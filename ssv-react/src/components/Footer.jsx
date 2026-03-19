import { Link } from 'react-router-dom'

export default function Footer() {
  const announcementItems = [
    <>
      <strong>NOTE:</strong>  We accept all types of custom designs in Gold and Silver to match your style and preferences.
    </>,
    <>
      <strong>Gold Ornaments:</strong> Gold Wastage: Only 8% VA | No Making Charges
    </>,
    <>
      <strong>Silver Ornaments:</strong> Lower and more reasonable prices compared to other markets.
    </>,
  ]

  return (
    <footer className="site-footer" aria-label="Website footer">
      <div className="footer-announcement" aria-label="Custom design announcement">
        <div className="footer-announcement__viewport">
          <div className="footer-announcement__track">
            {[0, 1].map(loopIndex => (
              <div
                key={loopIndex}
                className="footer-announcement__group"
                aria-hidden={loopIndex === 1 ? 'true' : undefined}
              >
                <span className="footer-announcement__spacer" aria-hidden="true" />
                {announcementItems.map((item, itemIndex) => (
                  <p key={`${loopIndex}-${itemIndex}`} className="footer-announcement__text">
                    {item}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-shell">
        <div className="footer-head">
          <div className="footer-brand">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3 className="footer-logo">SSV JEWELLERS</h3>
              <p>Wholesale &amp; Retail</p>
            </Link>
          </div>
          <div className="footer-contact">
            <a href="tel:+919876543210">+91 98765 432101</a>
            <a
              href="https://wa.me/916281049201?text=Hi%2C%20I%E2%80%99m%20interested%20in%20your%20website.%20Could%20you%20please%20share%20more%20details%3F"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Chats
            </a>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-grid">
          <div className="footer-col glass-card shine-hover float-card">
            <h3>About Us</h3>
            <p>
              Timeless handcrafted jewellery celebrating love, legacy, and elegance — for every generation.
            </p>
          </div>

          <div className="footer-col glass-card shine-hover float-card">
            <h3>Open Hours</h3>
            <p>Monday: 8am – 5pm</p>
            <p>Tuesday–Friday: 11am – 6pm</p>
            <p>Saturday: 8am – 12pm</p>
          </div>

          <div className="footer-col glass-card shine-hover float-card">
            <h3>Address</h3>
            <p>Yellow brick road 111</p>
            <p>Fantasy Land</p>
            <p>Somewhere</p>
          </div>

          <div className="footer-col glass-card shine-hover float-card">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://www.facebook.com/ssvjeweller" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="bi bi-facebook" aria-hidden="true" />
              </a>
              <a href="https://www.instagram.com/ssvjeweller" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="bi bi-instagram" aria-hidden="true" />
              </a>
              <a href="https://www.youtube.com/@ssvjeweller" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="bi bi-youtube" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copyright">Copyright &copy; {new Date().getFullYear()} SSV Jewellers</p>
          <div className="footer-legal">
            <Link to="/policies">Policies</Link>
            <Link to="/services">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
