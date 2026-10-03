import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/story', label: 'Story' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/contact', label: 'Contact' },
];

function Brand() {
  return (
    <Link className="brand" to="/">
      <img className="brand-mark" src={asset('img/logo.webp')} alt="" />
      <span className="wordmark"><span>Familiars</span><span>Workshop</span></span>
    </Link>
  );
}

export { Brand };

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
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
        </nav>
      </div>
    </header>
  );
}
