import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer" aria-label="Website footer">


      <div className="footer-grid-overlay" aria-hidden="true" />
      <div className="footer-glow" aria-hidden="true" />
      <div className="footer-shell">
        <div className="footer-main-grid">
          
          {/* Column 1: Brand & Connect */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand-link">
              <img src="/slides/pictures/logo-removebg-preview.png" alt="SSV Jewellers Logo" className="footer-logo-img" loading="lazy" decoding="async" />
              <h3 className="footer-brand-name">SSV JEWELLERS</h3>
            </Link>
            <p className="brand-desc">
             We are leading wholesalers with our own manufacturing unit, specializing in gold, silver, and diamond jewellery. All our products are certified and come with proper hallmark assurance for quality and trust.
            </p>
            <h4 className="footer-subtitle connect-title">CONNECT</h4>
            <a href="https://wa.me/9177396962?text=Hi" target="_blank" rel="noopener noreferrer" className="footer-whatsapp-btn">
              <i className="bi bi-whatsapp" /> WhatsApp
            </a>
          </div>

          {/* Column 2: Explore */}
          <div className="footer-col">
            <h4 className="footer-subtitle">Explore</h4>
            <ul className="footer-list">
              <li><Link to="/products?category=Necklaces">Necklace Collection</Link></li>
              <li><Link to="/products?category=Bangles">Bangles Collection</Link></li>
              <li><Link to="/products?category=Haram">Haram Collection</Link></li>
              <li><Link to="/products?category=Chokers">Chokers Collection</Link></li>
              <li><Link to="/products?category=CZ">CZ Collection</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care (Hours & Contact) */}
          <div className="footer-col">
            <h4 className="footer-subtitle">Customer Care</h4>
            <ul className="footer-list">
              <li><a href="tel:+919177396962">+91 9177396962</a></li>
              <li><a href="tel:+919515346355">+91 95153 46355</a></li>
              <li>📍 Address:
Shobha Pavani Arcade, Opp. Durgabai Deshmukh Hospital, Vidyanagar, Hyderabad – 500041

</li>
              <li className="hours-label">🕒 Timings:
</li>
              <li className="hours-label">10:00 AM – 10:00 PM</li>
              <li className="hours-label">Sunday Closed </li>
            </ul>
          </div>

          {/* Column 4: Legal & Social */}
          <div className="footer-col">
            <h4 className="footer-subtitle">Legal</h4>
            <ul className="footer-list">
              <li><Link to="/policies">Privacy Policy</Link></li>
              <li><Link to="/services">Terms & Conditions</Link></li>
              <li><Link to="/policies">Return Policy</Link></li>
            </ul>
            <div className="social-links-footer">
              <a href="https://facebook.com/profile.php?id=61584739588200" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bi bi-facebook" /></a>
              <a href="https://www.instagram.com/ssv_jewellers_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bi bi-instagram" /></a>
              <a href="https://www.youtube.com/@SSV_Jewellers" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="bi bi-youtube" /></a>
              <a href="mailto:[EMAIL_ADDRESS]" target="_blank" rel="noopener noreferrer" aria-label="gmail"><i className="bi bi-envelope" /></a>
            </div>
          </div>

        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copyright">Copyright &copy; {new Date().getFullYear()} SSV Jewellers</p>
          <div className="footer-legal-bottom">
            <Link to="/policies">Policies</Link>
            <Link to="/services">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
