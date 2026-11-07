import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
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

export default function Nav({ over }) {
  const [open, setOpen] = useState(false);
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
            <img src={asset('/img/home/enquiry/customfamiliarbutton.png')} alt="Custom Familiar" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
