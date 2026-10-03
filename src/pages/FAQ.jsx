import { useState } from 'react';
import { asset } from '../utils/assets';

const groups = [
  {
    id: 'before', title: 'Before you begin',
    qa: [
      ['How much does a Familiar talisman cost?', 'Each piece is quoted individually based on material, size, weight, and complexity. Past commissions in the Familiar Archive can be used as a guide.'],
      ['What is the design fee for?', 'It begins the portrait development process and covers the initial design and sculpting work. The final jewellery price is quoted separately.'],
      ['What photos do you need?', 'Clear photos from the front and both sides are most helpful, along with the expression you know best and any extra references that show their ears, coat, markings, or little quirks.'],
      ['Can you work from old or low-quality photos?', "Sometimes. We'll review what you have and let you know whether there is enough visual information to create an accurate portrait."],
      ['Can you make a Familiar of a pet who has passed away?', 'Yes. As long as there are enough usable reference photos, we can work from them.'],
    ],
  },
  {
    id: 'process', title: 'The portrait process',
    qa: [
      ['How long does a Familiar take?', "Portrait development usually takes around 2 weeks once we've received usable reference photos. After approval, casting and finishing usually takes around 3 weeks, followed by shipping."],
      ['Can I choose the expression?', 'Yes. We shape the portrait around the expression and details you want to preserve.'],
      ['Can I make changes to the first sculpt?', "Yes. You'll have a chance to review the first sculpt before production begins."],
      ['What happens after I approve the sculpt?', 'Once approved, your Familiar moves into casting and finishing. Changes may no longer be possible after this stage.'],
    ],
  },
  {
    id: 'materials', title: 'Materials & wear',
    qa: [
      ['What materials are available?', 'Familiars can be made in 925 sterling silver or gold, depending on the commission.'],
      ['Will sterling silver tarnish?', 'Sterling silver can naturally darken over time with wear and exposure to air. It can always be polished back to a brighter finish.'],
      ['Will gold change over time?', 'Gold is more resistant to tarnishing and keeps its colour well, though its appearance depends on karat and finish.'],
      ['Can I order the pendant without a chain?', 'Yes, if you prefer. The pendant can be ordered alone or paired with an available chain or cord.'],
    ],
  },
  {
    id: 'shipping', title: 'Shipping',
    qa: [
      ['Do you ship internationally?', 'Yes. Orders are shipped from Hong Kong with tracking. Shipping times vary by destination.'],
      ['Will I have to pay customs or duties?', 'Any import duties, taxes, or customs charges are determined by the destination country and are the responsibility of the recipient.'],
      ['What if my parcel is delayed or lost?', "Contact us with your order details and we'll help investigate with the carrier."],
    ],
  },
  {
    id: 'returns', title: 'Returns, refunds & cancellations',
    text: "Please include your order number with any messages regarding your package. Response time: 1-3 business days",
    qa: [
      ['Can I return my Familiar?', "Because each piece is made specifically to your animal's likeness, bespoke commissions are generally not eligible for change-of-mind returns."],
      ['Can the design fee be refunded?', 'Once design work has begun, the design fee is generally non-refundable because it covers work already carried out.'],
      ['Can I cancel my order?', 'Cancellations may be possible before design or production begins. Once sculpting or casting has started, fees already incurred may not be refundable.'],
      ['What if my piece arrives damaged or defective?', "Contact us as soon as possible with photos of the piece and packaging, and we'll review the issue and arrange the appropriate next step."],
    ],
  },
];

function Item({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={open ? 'faq-item open' : 'faq-item'}>
      <button className="faq-q" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span>{q}</span><span className="faq-mark">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="faq-a">{a}</p>}
    </div>
  );
}

export default function FAQ() {
  return (
    <main className="container faq">
      <h1>Frequently Asked</h1>
      {groups.map((g) => (
        <section key={g.id}>
          <h2 id={g.id}>{g.title}</h2>
          {g.text && <h3>{g.text}</h3>}
          {g.qa.map(([q, a]) => <Item key={q} q={q} a={a} />)}
        </section>
      ))}
    </main>
  );
}
