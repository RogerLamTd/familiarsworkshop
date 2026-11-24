import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { asset } from '../utils/assets';
import { useFormatPrice } from '../utils/currency.jsx';
import EnquiryForm from '../components/EnquiryForm.jsx';
import { familiars } from '../data/familiars.js';

// Each frame keeps its NATURAL aspect ratio (pieces end up different widths at a
// shared height -> size variety in the marquee). `win` = [left,top,width,height] %
// of the frame's window, auto-measured from the frame's transparent region.
// mode 'window' = photo sits behind, shows through the cut-out; 'backdrop' = art
// behind, photo laid on top. `round` crops the photo to a circle.
const FRAMES = {
  // win = inner opening measured from each PNG's alpha; rectangles are inset ~3% more
  // than the opening so a little border shows between photo and frame (like the circle)
  vertical: { img: 'home/marquee/vertical.webp', ratio: 0.75, mode: 'window', win: [16.4, 9.0, 67.2, 82.0] },
  circle: { img: 'home/marquee/circle.webp', ratio: 1.0, mode: 'window', win: [8.7, 9.0, 82.4, 80.4], round: true },
  horizontal: { img: 'home/marquee/horizontal frame.webp', ratio: 1.333, mode: 'window', win: [9.0, 16.4, 82.0, 67.2] },
  square: { img: 'home/marquee/square.webp', ratio: 1.0, mode: 'window', win: [14.1, 13.7, 71.7, 72.2] },
};

// `familiar` = id of the matching Portfolio familiar (opens its popup on click).
// Price (HKD) and material come from that Portfolio entry so the two pages can't disagree.
const archive = [
  { name: 'The Professional Critic', familiar: 'grumpy-cotton',
    frame: 'vertical', photo: 'home/marquee/critic-photo.webp', alt: 'Gold Pekingese pendant' },
  { name: 'The Leading Man', familiar: 'bleu',
    frame: 'circle', photo: 'home/marquee/leadingman-photo.webp', alt: 'Silver earrings' },
  { name: 'The Usual Suspect', familiar: 'gaygay',
    frame: 'horizontal', photo: 'home/marquee/suspect-photo.webp', alt: 'Silver corgi pendant' },
  { name: 'The Understudy', familiar: 'cotton',
    frame: 'square', photo: 'home/marquee/fourth-photo.webp', alt: 'Silver dog pendant' },
].map((p) => {
  const { price, material } = familiars.find((f) => f.id === p.familiar);
  return { ...p, price, material };
});

const filters = [
  { key: 'all', label: 'All' },
  { key: 'silver', label: 'Sterling Silver' },
  { key: 'gold', label: 'Gold' },
];

// the 4-part commission process (illustrations in img/instruction)
const steps = [
  { n: '01', img: 'step1.webp', title: 'The Introduction',
    text: "Share your pet's photos and the piece you have in mind." },
  { n: '02', img: 'step2.webp', title: 'The Commission',
    text: 'We review your enquiry and return with our recommendations, material options, and an estimated quote.' },
  { n: '03', img: 'step3.webp', title: 'The Portrait',
    text: 'A kick-off fee begins the sculpting process. Your talisman is designed for your approval.' },
  { n: '04', img: 'step4.webp', title: 'The Making',
    text: 'Once approved, the portrait is cast in precious metal and finds its way to you.' },
];

function Piece({ p }) {
  const f = FRAMES[p.frame];
  const fmt = useFormatPrice();
  const [l, t, w, h] = f.win;
  const photoStyle = {
    left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%`,
    borderRadius: f.round ? '50%' : 0,
  };
  return (
    <Link className="piece" to={`/portfolio?familiar=${p.familiar}`}>
      <div className={`piece-frame ${f.mode}`} style={{ aspectRatio: f.ratio }}>
        <img className="photo" style={photoStyle} loading="lazy" src={asset(`/img/${p.photo}`)} alt={p.alt} />
        <img className="frame" loading="lazy" src={asset(`/img/${f.img}`)} alt="" />
      </div>
      <div className="piece-cap">
        <div className="name">{p.name}</div>
        {p.price && <div className="price">{fmt(p.price)}</div>}
      </div>
    </Link>
  );
}

// One row of pieces. If they fit, show them static & centered; if they overflow,
// switch to the seamless auto-scroll marquee (no scrollbar). Piece widths come from
// CSS aspect-ratio, so the hidden measurer is accurate before images load.
function ArchiveRow({ items }) {
  const measureRef = useRef(null);
  const [overflow, setOverflow] = useState(false);
  useEffect(() => {
    const check = () => {
      const el = measureRef.current;
      if (el) setOverflow(el.scrollWidth > el.parentElement.clientWidth + 1);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [items]);

  return (
    <div className="archive-wrap">
      <div className="archive-measure" ref={measureRef} aria-hidden>
        {items.map((p, i) => <Piece key={i} p={p} />)}
      </div>
      {overflow ? (
        <div className="marquee">
          <div className="marquee-track">
            {(() => {
              const base = [];
              while (base.length < 6) base.push(...items);
              return [...base, ...base].map((p, i) => <Piece key={i} p={p} />);
            })()}
          </div>
        </div>
      ) : (
        <div className="archive-static">
          {items.map((p, i) => <Piece key={i} p={p} />)}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [filter, setFilter] = useState('all');
  const shown = filter === 'all' ? archive : archive.filter((p) => p.material === filter);

  return (
    <main className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-art">
          <img className="hero-photo" src={asset("/img/home/enquiry/headbackground.webp")} alt="A woman with her dog and puppies" />
          <div className="hero-copy">
            <h1 className="display">Every talisman<br />begins with a face<br />you know by heart.</h1>
            <p className="hero-sub">Turn your beloved companion into a one-of-a-kind, handcrafted piece.</p>
          </div>
          <img className="hero-stamp" src={asset("/img/logos/stamp.webp")} alt="" />
        </div>
        <aside className="hero-form">
          <EnquiryForm />
        </aside>
      </section>

      {/* ARCHIVE */}
      <section className="container sec">
        <div className="sec-head">
          <div>
            <h2 className="serif-h">The Familiar Archive</h2>
            <p className="sec-sub">A collection of Familiars we've had the pleasure of bringing to life.</p>
          </div>
          <div className="archive-filter">
            {filters.map((f) => (
              <button key={f.key}
                className={filter === f.key ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <ArchiveRow items={shown} />
        <p className="archive-foot">Browse past portraits, materials, sizes and quoted prices.</p>
      </section>

      {/* BESPOKE PROMISE + COMMISSION PROCESS */}
      <section className="bespoke">
        <img className="blossom r" loading="lazy" src={asset("/img/home/instruction/peach blossom.webp")} alt="" />
        <div className="container">
          <img className="hero-stamp" src={asset("/img/logos/stamp.webp")} alt="" />
          <p className="promise-label">our <b>Bespoke</b> promise to you</p>
          <p className="promise">To make something that could only belong to you &mdash;<br/> and only look like them</p>
          <ol className="commission">
            {steps.map((s) => (
              <li className="cstep" key={s.n}>
                <div className="cnum">{s.n}</div>
                <img className="cimg" loading="lazy" src={asset(`/img/home/instruction/${s.img}`)} alt="" />
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* NOTE FROM THE WORKSHOP */}
      <section className="note">
        <img loading="lazy" src={asset("/img/story/home-story.webp")} alt="" />
        <div className="inner">
          <span className="eyebrow">A note from the workshop</span>
          <p>We believe that the animals beside us are more than companions.</p>
          <p>They are quiet guardians, teachers, witnesses &mdash; familiar souls who stay close.</p>
          <p><span className="brandline">Familiars Workshop</span> crafts talismans in their likeness, made to last.</p>
          <Link className="readlink" to="/story"><b>READ OUR STORY &rarr;</b></Link>
        </div>
      </section>
    </main>
  );
}
