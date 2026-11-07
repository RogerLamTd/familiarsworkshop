import EnquiryForm from '../components/EnquiryForm.jsx';
import { asset } from '../utils/assets';

export default function Contact() {
  return (
    <main>
      <section className="contact-hero">
        <div className="art">
          <img src={asset("/img/contact/contact-hero.webp")} alt="A deer beneath blossoming trees" />
          <h1 className="display">Get in touch with our craftspeople</h1>
          <img className="contact-stamp" src={asset("/img/logos/stamp.png")} alt="" />
        </div>
        
        <div className="panel">
          <EnquiryForm mode="send" />
        </div>
      </section>
    </main>
  );
}
