// GET /api/rates: HKD exchange rates (keeps the exchangerate-api key out of the browser).
// POST /api/enquiry: verify Turnstile, then email the form (with photos attached) via Resend.
// Everything else is served by static assets; only /api/* reaches this Worker.
const FIELDS = ['Name', 'Email', 'Phone', 'Instagram', 'Material', 'Familiar', 'Code'];
const MAX_BYTES = 25 * 1024 * 1024; // Resend caps an email at 40MB after base64 (+33%)

// Workers have no Buffer; chunk so big images don't blow the call stack
const b64 = (buf) => {
  const b = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
  return btoa(s);
};
const fail = (error, status) => Response.json({ error }, { status });

export default {
  async fetch(req, env) {
    const path = new URL(req.url).pathname;

    // HKD exchange rates; the key stays server-side and Cloudflare caches the upstream call for 12h
    if (path === '/api/rates') {
      const r = await fetch(`https://v6.exchangerate-api.com/v6/${env.EXCHANGERATE_API_KEY}/latest/HKD`,
        { cf: { cacheTtl: 43200, cacheEverything: true } });
      const data = await r.json().catch(() => ({}));
      if (data.result !== 'success') return fail('Rates unavailable', 502);
      return Response.json(data.conversion_rates, { headers: { 'Cache-Control': 'public, max-age=3600' } });
    }

    if (path !== '/api/enquiry' || req.method !== 'POST') return fail('Not found', 404);
    if (+req.headers.get('content-length') > MAX_BYTES) return fail('Photos are too large (25MB total max).', 413);

    const form = await req.formData();

    const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: form.get('cf-turnstile-response') || '',
        remoteip: req.headers.get('CF-Connecting-IP') || '',
      }),
    }).then((r) => r.json());
    if (!check.success) return fail('Spam check failed, please try again.', 403);

    // the browser's `required` is a hint; this is the real check
    const val = (k) => (form.get(k) || '').toString().trim();
    if (!val('Email') || !val('Phone')) return fail('Email and phone are required.', 400);

    const files = [...form.entries()].filter(([, v]) => v instanceof File && v.size);
    const attachments = await Promise.all(files.map(async ([field, f], i) => ({
      filename: `${field}-${i + 1}-${f.name}`,
      content: b64(await f.arrayBuffer()),
    })));

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Familiars Workshop <enquiries@familiarsworkshop.com>',
        to: env.ENQUIRY_TO,
        reply_to: val('Email'),
        subject: `Enquiry from ${(val('Name') || val('Email')).replace(/[\r\n]/g, ' ')}`,
        text: FIELDS.filter(val).map((k) => `${k}: ${val(k)}`).join('\n'),
        attachments,
      }),
    });
    if (!res.ok) {
      console.error('resend', res.status, await res.text());
      return fail('Could not send right now, please try again.', 502);
    }
    return Response.json({ ok: true });
  },
};
