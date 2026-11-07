import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { asset } from '../utils/assets';
import { useFormatPrice } from '../utils/currency.jsx';

// `file` lives in both img/portfolio/dogview and img/portfolio/charmview; `photos`
// are the shots in img/portfolio/<slug>/ (slug = file without extension).
// material key -> label shown in the modal; extend as needed
const materials = { silver: '925 Sterling Silver', gold: '10k Yellow Gold' };
const familiars = [
  { id: 'teddy', name: 'Teddy', price: 2840, file: 'teddy.jpg', photos: ['1.jpg', '2.jpg', '3.jpg'],
    breed: 'Mixed Breed', origin: 'Canada', material: 'silver', size: '18mm (H) × 15mm (W) × 14mm (D)',
    familiar: "Teddy stirs up mischief unless he's the star. He loves splashes, chin rubs, and birds.",
    portrait: "We focused on his soulful eyes and gentle muzzle to preserve his mature character." },
  { id: 'lila', name: 'Lila', price: 2756, file: 'lila.jpg', photos: ['1.jpg', '2.jpg', '3.jpg'],
    breed: 'Pomeranian', origin: 'Hong Kong', material: 'silver', size: '18mm (H) × 15mm (W) × 12mm (D)',
    familiar: "A little ball of sunshine with a permanent smile, bright eyes, and ears that seem to have a mind of their own.",
    portrait: "We focused on her lively eyes, playful smile, and fluffy cheeks, preserving the little details that make this face unmistakable." },
  { id: 'boji', name: 'Boji', price: 2790, file: 'boji.jpg', photos: ['1.jpg', '2.jpg', '3.jpg'],
    breed: 'Border Collie', origin: 'Hong Kong', material: 'silver', size: '18mm (H) × 15mm (W) × 12mm (D)',
    familiar: "Hailing from one of the smartest dog breeds, he's delightfully goofy and not the sharpest.",
    portrait: "We focused on his flowing fluffy fur and heterochromatic eyes to capture his joyful essence." },
  { id: 'bingbing', name: 'BingBing', price: 2735, file: 'bingbing.jpg', photos: ['1.jpg', '2.jpg', '3.jpg'],
    breed: 'Pomeranian', origin: 'Hong Kong', material: 'silver', size: '19mm (H) × 12mm (W) × 13mm (D)',
    familiar: "A little lady with big, curious eyes and a wardrobe that suggests she knows exactly how adorable she is.",
    portrait: "We captured her gentle gaze, delicate muzzle, fluffy cheeks, and signature bow to preserve her sweet, unmistakable charm." },
  { id: 'hungry-bleu', name: 'Hungry Bleu', price: 2780, file: 'bleuhungry.jpg', photos: ['1.jpg', '2.jpg', '3.png'],
    breed: 'Schnauzer', origin: 'Hong Kong', material: 'silver', size: '17mm (H) × 13mm (W) × 14mm (D)',
    familiar: "Quite the ladies' man, with a magnificent moustache and a constant need to be adored.",
    portrait: "We focused on his bushy brows, floppy ears, signature schnauzer beard, and playful tongue to capture his irresistible charm." },
  { id: 'bleu', name: 'Bleu', price: 2770, file: 'bleu.jpg', photos: ['1.jpg', '2.jpg', '3.jpg'],
    breed: 'Schnauzer', origin: 'Hong Kong', material: 'silver', size: '17mm (H) × 13mm (W) × 14mm (D)',
    familiar: "Quite the ladies' man, with a magnificent moustache and a constant need to be adored.",
    portrait: "We focused on his bushy brows, floppy ears, and signature schnauzer beard to capture his irresistible charm." },
  { id: 'gaygay', name: 'Gay-Gay', price: 2700, file: 'gaygay.jpg', photos: ['1.jpg', '2.jpg', '3.JPG'],
    breed: 'Corgi', origin: 'Hong Kong', material: 'silver', size: '19mm (H) × 13mm (W) × 13mm (D)',
    familiar: "A happy little fellow with a contagious smile, oversized ears, and a face that makes saying no nearly impossible.",
    portrait: "We focused on his perky ears, round expressive eyes, fluffy cheeks, and signature tongue-out smile to capture his cheerful spirit." },
  { id: 'grumpy-cotton', name: 'Grumpy Cotton', price: 4980, file: 'cottongrumpy.jpg', photos: ['1.jpg', '2.jpg', '3.JPG'],
    breed: 'Pekingese', origin: 'Hong Kong', material: 'gold', size: '14mm (H) × 12mm (W) × 10mm (D)',
    familiar: "A little royal with a permanently unimpressed expression, who expects to be treated like the most important person in the room.",
    portrait: "We focused on those sleepy eyes, rounded muzzle, signature underbite, and soft floppy ears to preserve his adorably stern expression." },
  { id: 'cotton', name: 'Cotton', price: 2840, file: 'cotton.jpg', photos: ['1.jpg', '2.jpg', '3.jpg'],
    breed: 'Pekingese', origin: 'Hong Kong', material: 'silver', size: '14mm (H) × 12mm (W) × 10mm (D)',
    familiar: "A little royal who rarely cracks a smile. When he does, it's quite the occasion.",
    portrait: "We focused on his rare little smile, rounded muzzle, gentle eyes, and floppy ears to preserve a softer side of his usually serious expression." },
];

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
            <div className="arch-img"><img src={src(f)} alt={f.name} /></div>
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
