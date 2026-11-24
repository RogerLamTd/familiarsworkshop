import { Link } from 'react-router-dom';
import { Brand } from './Nav.jsx';
import { asset } from '../utils/assets';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Brand />
        {/* stacked logo, swapped in for <Brand /> on phones via CSS */}
        <Link className="footer-logo" to="/">
          <img src={asset('img/logos/mobile-logo.svg')} alt="Familiars Workshop" />
        </Link>
        <div>
          <h5>Company</h5>
          <ul>
            <li><Link to="/faq#shipping">Shipping Policy</Link></li>
            <li><Link to="/faq#returns">Refunds &amp; Returns</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h5>Links</h5>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/story">Story</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h5>Contact</h5>
          <p className="contact-txt">Email us at<br /><a href="mailto:business@familiarsworkshop.com">business@familiarsworkshop.com</a></p>
        </div>
      </div>
    </footer>
  );
}
