import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Story from './pages/Story.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Contact from './pages/Contact.jsx';
import FAQ from './pages/FAQ.jsx';

export default function App() {
  const { pathname, hash } = useLocation();
  // SPA scroll handling: jump to #hash target if present, else top of page.
  // Images above the target load async and shift layout, so re-pin whenever a
  // still-loading image finishes (plus timed fallbacks) until things settle.
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const id = hash.slice(1);
    let done = false;
    const pin = () => {
      if (done) return;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ block: 'start' });
    };
    const imgs = Array.from(document.images).filter((im) => !im.complete);
    imgs.forEach((im) => im.addEventListener('load', pin));
    const timers = [0, 200, 600, 1200].map((d) => setTimeout(pin, d));
    const stop = setTimeout(() => {
      done = true;
      imgs.forEach((im) => im.removeEventListener('load', pin));
    }, 3000);
    return () => {
      done = true;
      [...timers, stop].forEach(clearTimeout);
      imgs.forEach((im) => im.removeEventListener('load', pin));
    };
  }, [pathname, hash]);

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story" element={<Story />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
      <Footer />
    </>
  );
}
