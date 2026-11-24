import EnquiryForm from '../components/EnquiryForm.jsx';
import { asset } from '../utils/assets';

// Same split as the home hero (shared .hero classes) so the form and stamp line up exactly.
export default function Contact() {
  return (
    <main>
      <section className="hero">
        <div className="hero-art hero-art--fade">
          <img className="hero-photo" src={asset('/img/contact/contact-hero.webp')} alt="A deer beneath blossoming trees" />
          <div className="hero-copy">
            <h1 className="display">Get in touch<br />with our<br />craftspeople</h1>
          </div>
          <img className="hero-stamp" src={asset('/img/logos/stamp.webp')} alt="" />
        </div>
        <aside className="hero-form">
          <EnquiryForm />
        </aside>
      </section>
    </main>
  );
}
