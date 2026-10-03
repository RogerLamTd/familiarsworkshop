import { Link } from 'react-router-dom';
import { Brand } from './Nav.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Brand />
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
          <p className="contact-txt">Email us at<br />business@familiarsworkshop.com</p>
        </div>
      </div>
    </footer>
  );
}
