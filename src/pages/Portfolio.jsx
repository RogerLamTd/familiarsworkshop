import { useState } from 'react';
import { Link } from 'react-router-dom';

// specs Portrait Size / Quote were placeholders in the original Canva export —
// fill real values here when available.
const cases = [
  {
    id: 'cotton-gold',
    name: 'Cotton', variant: 'full', breed: 'Pekingese, Hong Kong',
    images: [
      { src: 'cotton1-main.webp', alt: 'Gold Cotton pendant in a crystal dish' },
      { src: 'cotton1-top.webp', alt: 'Cotton the Pekingese' },
      { src: 'cotton1-bot.webp', alt: 'Gold Cotton pendant on a cord' },
    ],
    specs: [['Material', '10k yellow gold'], ['Portrait Size', '—'], ['Quote', '—']],
    familiar: 'Permanently unimpressed. Selective with affection. Much more interested in strangers than his own family.',
    portrait: 'We focused on his heavy-lidded stare, short muzzle and unmistakably serious expression.',
  },
  {
    id: 'cotton-silver',
    name: 'Cotton', variant: 'full', breed: 'Pekingese, Hong Kong',
    images: [
      { src: 'cotton2-main.webp', alt: 'Silver Cotton pendant on a green backdrop' },
      { src: 'cotton2-top.webp', alt: 'Cotton resting on a table' },
      { src: 'cotton2-bot.webp', alt: 'Silver Cotton pendant held in a hand' },
    ],
    specs: [['Material', '10k yellow gold'], ['Portrait Size', '—'], ['Quote', '—']],
    familiar: 'A softer sighting of Cotton. Bright eyed, pleased with himself, and momentarily convinced the world has done something right.',
    portrait: 'We focused on his round eyes, relaxed little smile, and his soft expression.',
  },
  {
    id: 'gaygay',
    name: 'Gay-Gay', variant: 'hand', breed: 'Corgi, Hong Kong',
    images: [
      { src: 'gaygay-main.webp', alt: 'Silver Gay-Gay pendant among orchids' },
      { src: 'gaygay-top.webp', alt: 'Gay-Gay the Corgi' },
      { src: 'gaygay-bot.webp', alt: 'Silver Gay-Gay pendant held in a hand' },
    ],
    lines: [
      'Wide-eyed, slightly guilty, and permanently looking like he has just done something he hopes you won\'t ask about.',
      'We focused on his big alert ears, round eyes, and that slightly guilty little expression that makes him instantly recognisable.',
    ],
  },
  {
    id: 'schnauzer',
    name: 'The Schnauzer', variant: 'hand',
    images: [
      { src: 'schnauzer-main.webp', alt: 'Silver Schnauzer earrings on red velvet' },
      { src: 'schnauzer-top.webp', alt: 'The Schnauzer mid-yawn' },
      { src: 'schnauzer-bot.webp', alt: 'The Schnauzer resting' },
    ],
    lines: ['Composed, handsome, and effortlessly photogenic.'],
  },
];

function Gallery({ images }) {
  const [active, setActive] = useState(0);
  const rest = images.map((_, i) => i).filter((i) => i !== active);
  return (
    <>
      <div className="main">
        <img src={`/img/${images[active].src}`} alt={images[active].alt} />
      </div>
      <div className="stack">
        {rest.map((i) => (
          <img key={i} src={`/img/${images[i].src}`} alt={images[i].alt}
            className="thumb" onClick={() => setActive(i)} />
        ))}
      </div>
    </>
  );
}

function Case({ c }) {
  return (
    <section id={c.id} className={c.variant === 'hand' ? 'case case--hand' : 'case'}>
      <Gallery images={c.images} />
      <div className="info">
        <h3>{c.name} <img className="deer-mark" src="/img/logo.webp" alt="" /></h3>
        {c.breed && <p className="breed">{c.breed}</p>}
        {c.variant === 'full' ? (
          <>
            <dl className="specs">
              {c.specs.map(([dt, dd]) => (
                <div key={dt} style={{ display: 'contents' }}>
                  <dt>{dt}</dt><dd>{dd}</dd>
                </div>
              ))}
            </dl>
            <h4>The Familiar</h4>
            <p>{c.familiar}</p>
            <h4>The Portrait</h4>
            <p>{c.portrait}</p>
            <Link className="btn" to="/contact">Make your Familiar</Link>
          </>
        ) : (
          c.lines.map((line, i) => <p key={i}>{line}</p>)
        )}
      </div>
    </section>
  );
}

export default function Portfolio() {
  return (
    <main className="container">
      {cases.map((c, i) => <Case key={i} c={c} />)}
    </main>
  );
}
