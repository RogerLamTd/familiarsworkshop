import { useState } from 'react';

// No backend: submitting builds a mailto: link and opens the user's mail client,
// then shows a confirmation. `fields` = [{ name, label, type?, required?, placeholder? }]
export default function MailtoForm({ to, subject, fields, note, submitLabel = 'Send an Enquiry' }) {
  const [values, setValues] = useState({});
  const [sent, setSent] = useState(false);

  const onChange = (name) => (e) =>
    setValues((v) => ({ ...v, [name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const lines = fields
      .filter((f) => (values[f.name] || '').trim())
      .map((f) => `${f.label}: ${values[f.name].trim()}`);
    const body = encodeURIComponent(lines.join('\n'));
    window.location.href =
      `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <p className="form-sent" role="status">
        Thank you — your email app should have opened with your enquiry.
        If it didn't, write to us at {to}.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      {fields.map((f) => (
        <div className="field" key={f.name}>
          <label htmlFor={f.name}>{f.label}</label>
          {f.type === 'textarea' ? (
            <textarea id={f.name} name={f.name} placeholder={f.placeholder}
              value={values[f.name] || ''} onChange={onChange(f.name)} />
          ) : (
            <input id={f.name} name={f.name} type={f.type || 'text'}
              placeholder={f.placeholder} required={f.required}
              value={values[f.name] || ''} onChange={onChange(f.name)} />
          )}
        </div>
      ))}
      {note && <p className="form-note">{note}</p>}
      <button className="btn btn--block" type="submit">{submitLabel}</button>
    </form>
  );
}
