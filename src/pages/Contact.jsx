import MailtoForm from '../components/MailtoForm.jsx';

export default function Contact() {
  return (
    <main>
      <section className="contact-hero">
        <div className="art">
          <img src="/img/contact-hero.webp" alt="A deer beneath blossoming trees" />
          <h1 className="display">Get in touch with our craftspeople</h1>
        </div>
        <div className="panel">
          <h2 className="serif-h">TELL US ABOUT YOUR FAMILIAR</h2>
          <MailtoForm
            to="business@familiarsworkshop.com"
            subject="Contact — Familiars Workshop"
            fields={[
              { name: 'Name', label: 'Name', required: true },
              { name: 'Email', label: 'Email', type: 'email', required: true },
              { name: 'Instagram', label: 'Instagram handle', placeholder: 'Optional' },
              { name: 'Phone', label: 'Phone Number' },
              { name: 'Comment', label: 'Comment', type: 'textarea' },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
