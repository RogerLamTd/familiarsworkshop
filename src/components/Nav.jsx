import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { asset } from '../utils/assets';
import { useCurrency, CURRENCIES } from '../utils/currency.jsx';

function CurrencyToggle() {
  const { code, setCode } = useCurrency();
  const label = CURRENCIES.find((c) => c.code === code)?.label || code;
  return (
    <label className="currency-toggle" aria-label="Currency">
      <span>{label}</span>
      <select value={code} onChange={(e) => setCode(e.target.value)}>
        {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
      </select>
    </label>
  );
}

const links = [
  { to: '/', label: 'Home' },
  { to: '/story', label: 'Story' },
  { to: '/portfolio', label: 'Portfolio' },
];

function Brand() {
  return (
    <Link className="brand" to="/">
      <img className="brand-mark" src={asset('img/logos/logo.svg')} alt="" />
      <span className="wordmark"><span>Familiars</span><span>Workshop</span></span>
    </Link>
  );
}

export { Brand };

// seasonal popup: opens once (home page, first visit); the tree button in the nav reopens it. Bump the key for the next campaign.
const PROMO_KEY = 'fw-promo-christmas';
const seen = () => { try { return localStorage.getItem(PROMO_KEY); } catch { return true; } };

export default function Nav({ over }) {
  const [open, setOpen] = useState(false);
  const [promo, setPromo] = useState(useLocation().pathname === '/' && !seen());
  const closePromo = () => { try { localStorage.setItem(PROMO_KEY, '1'); } catch {} setPromo(false); };
  const dlg = useRef(null);
  useEffect(() => { if (promo) dlg.current?.showModal(); }, [promo]);  // native modal: Esc closes, focus trapped
  return (
    <header className={over ? 'nav nav--over' : 'nav'}>
      <div className="nav-inner">
        <Brand />
        <button className="nav-toggle" aria-label="Menu" aria-expanded={open}
          onClick={() => setOpen((v) => !v)}>&#9776;</button>
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
              onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <CurrencyToggle />
          <Link className="nav-cta" to="/contact" onClick={() => setOpen(false)}>
            <img src={asset('/img/home/enquiry/customfamiliarbutton.webp')} alt="Custom Familiar" />
          </Link>
        </nav>
        <button className="promo-btn" title="Christmas Collection" aria-label="Christmas Collection" onClick={() => setPromo(true)}>
          <span className="view-icon" style={{ '--icon': `url("${asset('/img/home/christmas-banner/christmas-tree.svg')}")` }} />
        </button>
      </div>
      {promo && (
        <dialog ref={dlg} className="promo" aria-label="Christmas Collection" onClose={closePromo}>
          <a href="https://familiarsworkshop.myshopify.com/" target="_blank" rel="noopener" onClick={closePromo}>
            <img src={asset('/img/home/christmas-banner/christmas-banner-text.webp')} alt="Christmas Collection out now — click here (opens in a new tab)" />
          </a>
          <button className="promo-close" onClick={closePromo} aria-label="Close">&times;</button>
        </dialog>
      )}
    </header>
  );
}
