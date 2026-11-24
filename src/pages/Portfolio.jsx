import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { asset } from '../utils/assets';
import { useFormatPrice } from '../utils/currency.jsx';
import { familiars } from '../data/familiars.js';

// material key -> label shown in the modal; extend as needed
const materials = { silver: '925 Sterling Silver', gold: '10k Yellow Gold' };

const VIEWS = { dog: 'dogview', pendant: 'charmview' };

// multi-photo gallery from img/portfolio/<slug>/: main image + thumbnails
function Gallery({ f }) {
  const slug = f.file.replace(/\.[^.]+$/, '');
  const photos = f.photos || [];
  const [active, setActive] = useState(0);
  const url = (p) => asset(`/img/portfolio/${slug}/${p}`);
  return (
    <div className="arch-gallery">
      <div className="arch-gallery-main"><img src={url(photos[active])} alt={f.name} /></div>
      {photos.length > 1 && (
        <div className="arch-gallery-thumbs">
          {photos.map((p, i) => (
            <button key={i} type="button" aria-label={`Photo ${i + 1}`}
              className={i === active ? 'active' : ''} onClick={() => setActive(i)}>
              <img src={url(p)} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Modal({ f, fmt, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="arch-modal-overlay" onClick={onClose}>
      <div className="arch-modal" role="dialog" aria-label={f.name} onClick={(e) => e.stopPropagation()}>
        <button className="arch-modal-x" onClick={onClose} aria-label="Close">×</button>
        <Gallery f={f} />
        <h2>{f.name.toUpperCase()}</h2>
        <p className="arch-breed">{f.breed}, {f.origin}</p>
        <dl className="arch-specs">
          <div><dt>Material</dt><dd>{materials[f.material]}</dd></div>
          <div><dt>Portrait Size</dt><dd>{f.size}</dd></div>
          <div><dt>Quote</dt><dd>{fmt(f.price)}</dd></div>
        </dl>
        <h3>The Familiar</h3>
        <p>{f.familiar}</p>
        <h3>The Portrait</h3>
        <p>{f.portrait}</p>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [view, setView] = useState('dog');
  const [sel, setSel] = useState(null);
  const fmt = useFormatPrice();
  const src = (f) => asset(`/img/portfolio/${VIEWS[view]}/${f.file}`);

  // open a familiar's popup directly when linked as /portfolio?familiar=<id>
  const [params, setParams] = useSearchParams();
  const wanted = params.get('familiar');
  useEffect(() => {
    const f = familiars.find((x) => x.id === wanted);
    if (f) setSel(f);
  }, [wanted]);
  const close = () => {
    setSel(null);
    if (wanted) setParams({}, { replace: true }); // drop the param so it won't re-open
  };

  return (
    <main className="container archive-page">
      <div className="arch-head">
        <div>
          <h1 className="serif-h">The Familiars Archive</h1>
          <p className="sec-sub">A collection of Familiars we've had the pleasure of bringing to life.</p>
        </div>
      </div>

      {/* floating view switch — fixed to the right gutter, follows the scroll */}
      <div className="view-toggle view-toggle--float" role="tablist" aria-label="View">
        <button role="tab" aria-selected={view === 'dog'} title="Dog view" aria-label="Dog view"
          className={view === 'dog' ? 'active' : ''} onClick={() => setView('dog')}>
          <span className="view-icon" style={{ '--icon': `url("${asset('/img/portfolio/dog-paw.svg')}")` }} />
        </button>
        <button role="tab" aria-selected={view === 'pendant'} title="Pendant view" aria-label="Pendant view"
          className={view === 'pendant' ? 'active' : ''} onClick={() => setView('pendant')}>
          <span className="view-icon" style={{ '--icon': `url("${asset('/img/portfolio/necklace.svg')}")` }} />
        </button>
      </div>

      <div className="arch-grid">
        {familiars.map((f) => (
          <button className="arch-card" key={f.id} onClick={() => setSel(f)}>
            <div className="arch-img"><img loading="lazy" src={src(f)} alt={f.name} /></div>
            <div className="arch-cap">
              <span className="name">{f.name}</span>
              <span className="price">{fmt(f.price)}</span>
            </div>
          </button>
        ))}
      </div>

      {sel && <Modal f={sel} fmt={fmt} onClose={close} />}
    </main>
  );
}
