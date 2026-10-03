import { useState } from 'react';
import { Link } from 'react-router-dom';
import MailtoForm from '../components/MailtoForm.jsx';

// Each frame keeps its NATURAL aspect ratio (pieces end up different widths at a
// shared height -> size variety in the marquee). `win` = [left,top,width,height] %
// of the frame's window, auto-measured from the frame's transparent region.
// mode 'window' = photo sits behind, shows through the cut-out; 'backdrop' = art
// behind, photo laid on top. `round` crops the photo to a circle.
const FRAMES = {
  floral: { img: 'frame-floral.webp', ratio: 0.667, mode: 'window', win: [16.9, 11.5, 65.8, 77.0] },
  ukiyoe: { img: 'frame-ukiyoe.webp', ratio: 0.709, mode: 'backdrop', win: [8, 7, 84, 87] },
  maze: { img: 'frame-maze.webp', ratio: 1.0, mode: 'window', win: [17.8, 29.4, 64.4, 41.0] },
  ring: { img: 'leadingman-plate.webp', ratio: 0.964, mode: 'window', win: [21.1, 20.2, 58.3, 56.4], round: true },
};

// `link` = portfolio section anchor for that animal (see ids in Portfolio.jsx)
const archive = [
  { name: 'The Professional Critic', price: '$9,000', material: 'gold',
    frame: 'floral', photo: 'critic-photo.webp', alt: 'Gold Pekingese pendant', link: '#cotton-gold' },
  { name: 'The Leading Man', material: 'silver',
    frame: 'ring', photo: 'leadingman-photo.webp', alt: 'Silver earrings', link: '#schnauzer' },
  { name: 'The Usual Suspect', material: 'silver',
    frame: 'ukiyoe', photo: 'suspect-photo.webp', alt: 'Silver corgi pendant', link: '#gaygay' },
  { name: 'The Understudy', material: 'silver',
    frame: 'maze', photo: 'fourth-photo.webp', alt: 'Silver dog pendant', link: '#cotton-silver' },
];

const filters = [
  { key: 'all', label: 'All' },
  { key: 'silver', label: 'Sterling Silver' },
  { key: 'gold', label: 'Gold' },
];

function Piece({ p }) {
  const f = FRAMES[p.frame];
  const [l, t, w, h] = f.win;
  const photoStyle = {
    left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%`,
    borderRadius: f.round ? '50%' : 0,
  };
  return (
    <Link className="piece" to={`/portfolio${p.link}`}>
      <div className={`piece-frame ${f.mode}`} style={{ aspectRatio: f.ratio }}>
        <img className="photo" style={photoStyle} src={`/img/${p.photo}`} alt={p.alt} />
        <img className="frame" src={`/img/${f.img}`} alt="" />
      </div>
      <div className="piece-cap">
        <div className="name">{p.name}</div>
        {p.price && <div className="price">{p.price}</div>}
      </div>
    </Link>
  );
}

export default function Home() {
  const [filter, setFilter] = useState('all');
  const shown = filter === 'all' ? archive : archive.filter((p) => p.material === filter);

  return (
    <main className="home">
      {/* HERO */}
      <section className="container hero">
        <div className="hero-text">
          <h1 className="display">Every talisman begins with a face you know by heart.</h1>
        </div>
        <div className="hero-photo-wrap">
          <img className="hero-photo" src="/img/home-hero.webp" alt="Children with their dog" />
        </div>
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

        {filter === 'all' ? (
          <div className="marquee">
            {/* pad to >=6, then duplicate the base for a seamless slow
                auto-scroll (pauses on hover) */}
            <div className="marquee-track">
              {(() => {
                const base = [];
                while (base.length < 6) base.push(...shown);
                return [...base, ...base].map((p, i) => <Piece key={i} p={p} />);
              })()}
            </div>
          </div>
        ) : (
          /* filtered: static, centered, each shown once */
          <div className="archive-static">
            {shown.map((p, i) => <Piece key={i} p={p} />)}
          </div>
        )}
        <p className="archive-foot">Browse past portraits, materials, sizes and quoted prices.</p>
      </section>

      {/* BESPOKE PROMISE */}
      <section className="bespoke">
        <img className="blossom l" src="/img/blossom-left.webp" alt="" />
        <img className="blossom r" src="/img/blossom-right.webp" alt="" />
        <div className="container">
          <svg className="seal" viewBox="0 0 40 40" aria-hidden="true"><rect x="2" y="2" width="36" height="36" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" /><path d="M11 11h18v18H11z M11 20h18 M20 11v18" fill="none" stroke="currentColor" strokeWidth="2.5" /></svg>
          <p className="promise-label">our <b>Bespoke</b> promise to you</p>
          <p className="promise">To make something that could only belong to you &mdash; and only look like them</p>
        </div>
      </section>

      {/* READY TO BEGIN */}
      <section className="container ready">
        <img className="oval" src="/img/oval-necklace.webp" alt="Familiar pendant on a chain" />
        <div>
          <h2>Ready to <b>Begin?</b></h2>
          <p>Every Familiar talisman begins with an enquiry.<br />
            Once received, we begin studying their photos, expression and details;
            then, upon receiving the <b>design fee</b>, we develop the first portrait for your review.</p>
          <p>The final piece is quoted separately according to material, size and complexity.</p>
          <Link className="btn" to="/contact">Contact Us</Link>
        </div>
      </section>

      {/* NOTE FROM THE WORKSHOP */}
      <section className="note">
        <img src="/img/home-story.webp" alt="" />
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
