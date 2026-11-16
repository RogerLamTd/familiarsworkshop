import { useState, useEffect, useMemo, useRef } from 'react';
import { asset } from '../utils/assets';

// TEMP: local dev sends to a test inbox; production build still uses business@. Remove before merging.
const TO = import.meta.env.DEV ? 'you@example.com' : 'business@familiarsworkshop.com';
const SEND_BTN = '/img/home/enquiry/sendenquirybutton.png';
const MATERIALS = {
  'Silver': ['S925'],
  'Yellow Gold': ['YG9K', 'YG14K', 'YG18K', 'YG24K'],
  'White Gold': ['WG9K', 'WG14K', 'WG18K'],
  'Rose Gold': ['RG9K', 'RG14K', 'RG18K'],
};

// One photo slot: click to pick an image, shows a preview once chosen.
// `multiple` slots add to the selection on each pick; once filled, clicking opens a
// dialog listing every photo so they can be removed or more added.
function PhotoSlot({ name, label, icon, hint, className, multiple }) {
  const [files, setFiles] = useState([]);
  const urls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => urls.forEach((u) => URL.revokeObjectURL(u)), [urls]);
  const input = useRef(null);
  const dialog = useRef(null);
  const adding = useRef(false); // "Add" in the dialog clicks the input; don't reopen the dialog

  // write the full selection back to the input so the form submits exactly these files
  const sync = (next) => {
    const dt = new DataTransfer();
    next.forEach((f) => dt.items.add(f));
    input.current.files = dt.files;
    setFiles(next);
  };
  const onChange = (e) => {
    const picked = [...e.target.files];
    sync(!picked.length ? files : multiple ? [...files, ...picked] : picked); // cancelled pick keeps old
  };
  const onClick = (e) => {
    if (adding.current) { adding.current = false; return; }
    if (multiple && files.length) { e.preventDefault(); dialog.current.showModal(); }
  };
  const remove = (i) => {
    const next = files.filter((_, j) => j !== i);
    sync(next);
    if (!next.length) dialog.current.close();
  };

  return (
    <>
      <label className={className} onClick={onClick}>
        {urls[0] ? (
          <>
            <img src={urls[0]} alt={`${label} photo preview`} />
            {files.length > 1 && <span className="count">+{files.length - 1}</span>}
          </>
        ) : (
          <>
            <span className="plus">+</span>
            {icon ? <img className="slot-icon" src={asset(icon)} alt={label} /> : <span>{label}</span>}
            {hint && <i>{hint}</i>}
          </>
        )}
        <input ref={input} type="file" name={name} accept="image/jpeg,image/png,image/webp"
          multiple={multiple} onChange={onChange} />
      </label>
      {multiple && (
        <dialog ref={dialog} className="photo-dialog" aria-label={`${label} photos`}
          onClick={(e) => e.target === dialog.current && dialog.current.close()}>
          <h3>{label} photos</h3>
          <div className="photo-dialog-grid">
            {urls.map((u, i) => (
              <div key={u} className="thumb">
                <img src={u} alt={`${label} photo ${i + 1}`} />
                <button type="button" aria-label={`Remove photo ${i + 1}`} onClick={() => remove(i)}>×</button>
              </div>
            ))}
            <button type="button" className="thumb add"
              onClick={() => { adding.current = true; input.current.click(); }}>+ Add</button>
          </div>
          <button type="button" className="photo-dialog-done" onClick={() => dialog.current.close()}>Done</button>
        </dialog>
      )}
    </>
  );
}

// The gold-bordered enquiry card from the home hero, shared so the Contact page
// mirrors it exactly. Submitting opens a mailto with the entered details.
export default function EnquiryForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    // ponytail: mailto can't carry files, so we only note how many photos were picked
    const photos = [...d.values()].filter((v) => v instanceof File && v.size).length;
    const body = ['Name', 'Email', 'Phone', 'Instagram', 'Material', 'Familiar', 'Code']
      .map((k) => [k, (d.get(k) || '').toString().trim()])
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .concat(photos ? [`\nPhotos: ${photos} selected. Please attach them to this email.`] : [])
      .join('\n');
    window.location.href =
      `mailto:${TO}?subject=${encodeURIComponent('Enquiry — Familiars Workshop')}` +
      `&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="hero-card">
        <h2>A few details to get started.</h2>
        <p className="form-sent" role="status">
          Thank you — your email app should have opened with your enquiry.
          If it didn't, write to us at {TO}.
        </p>
      </div>
    );
  }

  return (
    <div className="hero-card">
      <h2>A few details to get started.</h2>
      <form onSubmit={onSubmit}>
        <div className="field-row">
          <div className="field">
            <label htmlFor="ef-name">Name</label>
            <input id="ef-name" name="Name" placeholder="Your name" autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="ef-email">Email <b aria-hidden>*</b></label>
            <input id="ef-email" name="Email" type="email" required placeholder="your@email.com" autoComplete="email" />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="ef-phone">Phone <b aria-hidden>*</b></label>
            <input id="ef-phone" name="Phone" type="tel" required placeholder="Phone number w/ Area code" autoComplete="tel" />
          </div>
          <div className="field">
            <label htmlFor="ef-ig">Instagram</label>
            <input id="ef-ig" name="Instagram" placeholder="@handle (optional)" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="ef-material">Material</label>
          <select id="ef-material" name="Material" defaultValue="">
            <option value="">Not sure yet</option>
            {Object.entries(MATERIALS).map(([group, codes]) => (
              <optgroup key={group} label={group}>
                {codes.map((c) => <option key={c}>{c}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ef-about">Tell us about your Familiar and the piece you have in mind.</label>
          <textarea id="ef-about" name="Familiar"
            placeholder="Their name, personality, favorite expression, and any details you'd like us to preserve." />
        </div>
        <div className="field">
          <span className="field-label">Share Photos <i>(optional)</i></span>
          <div className="refs">
            <PhotoSlot name="photo-main" className="ref-main" label="Main reference (front)" icon="img/home/enquiry/front.svg"
              hint="JPG, PNG, WEBP" />
            <PhotoSlot name="photo-left" label="Left side" icon="img/home/enquiry/left.svg" />
            <PhotoSlot name="photo-right" label="Right side" icon="img/home/enquiry/right.svg" />
            <PhotoSlot name="photo-others" label="Others" multiple />
          </div>
        </div>
        <div className="field">
          <label htmlFor="ef-code">Code</label>
          <input id="ef-code" name="Code" placeholder="Discount code (optional)" />
        </div>
        <button type="submit" className="send-btn">
          <img src={asset(SEND_BTN)} alt="Send an enquiry" />
        </button>
      </form>
    </div>
  );
}
