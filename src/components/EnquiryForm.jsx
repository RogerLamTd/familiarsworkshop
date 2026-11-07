import { useState } from 'react';
import { Link } from 'react-router-dom';
import { asset } from '../utils/assets';

const TO = 'business@familiarsworkshop.com';
const SEND_BTN = '/img/home/enquiry/sendenquirybutton.png';

// The gold-bordered enquiry card from the home hero, shared so the Contact page
// mirrors it exactly. mode="link" = home teaser (routes to /contact);
// mode="send" = Contact page (opens a mailto with the entered details).
export default function EnquiryForm({ mode = 'send' }) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = ['Name', 'Email', 'Instagram', 'Familiar']
      .map((k) => [k, (d.get(k) || '').toString().trim()])
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
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
      <form onSubmit={mode === 'send' ? onSubmit : (e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor="ef-name">Name</label>
          <input id="ef-name" name="Name" placeholder="Your name" />
        </div>
        <div className="field">
          <label htmlFor="ef-email">Email</label>
          <input id="ef-email" name="Email" type="email" placeholder="your@email.com" />
        </div>
        <div className="field">
          <label htmlFor="ef-ig">Instagram handle</label>
          <input id="ef-ig" name="Instagram" placeholder="Optional" />
        </div>
        <div className="field">
          <label htmlFor="ef-about">Tell us about your Familiar and the piece you have in mind.</label>
          <textarea id="ef-about" name="Familiar"
            placeholder="Their name, personality, favorite expression, preferred material, and any details you'd like us to preserve." />
        </div>
        <div className="field">
          <label>Share Photos</label>
          <label className="upload">
            <span className="plus">+</span>
            <span>Add a few photos<br />of your familiar.<br /><i>Optional</i></span>
            <input type="file" accept="image/*" multiple hidden />
          </label>
        </div>
        {mode === 'send' ? (
          <button type="submit" className="send-btn">
            <img src={asset(SEND_BTN)} alt="Send an enquiry" />
          </button>
        ) : (
          <Link className="send-btn" to="/contact">
            <img src={asset(SEND_BTN)} alt="Send an enquiry" />
          </Link>
        )}
      </form>
    </div>
  );
}
