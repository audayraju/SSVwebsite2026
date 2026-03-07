(function renderSharedFooter() {
    const footerHTML = `
<footer class="site-footer" aria-label="Website footer">
    <div class="footer-shell">
        <div class="footer-head">
            <div class="footer-brand">
                <h3 class="footer-logo">SSV JEWELLERS</h3>
                <p>Wholesale & Retail</p>
            </div>
            <div class="footer-contact">
                <a href="tel:+919876543210">+91 98765 43210</a>
                <a href="https://wa.me/916281049201?text=Hi%2C%20I%E2%80%99m%20interested%20in%20your%20website.%20Could%20you%20please%20share%20more%20details%3F" target="_blank" rel="noopener noreferrer">WhatsApp Chat</a>
            </div>
        </div>

        <div class="footer-divider"></div>

        <div class="footer-grid">
            <div class="footer-col glass-card shine-hover float-card">
                <h3>About us</h3>
                <p>Lorem ipsum dolor sit amet,<br>consectetur adipiscing elit. Ut<br>elit tellus, luctus nec.</p>
            </div>

            <div class="footer-col glass-card shine-hover float-card">
                <h3>Open hours</h3>
                <p>Monday: 8am - 5pm</p>
                <p>Tuesday-Friday: 11am - 6pm</p>
                <p>Saturday: 8.00am -12pm</p>
            </div>

            <div class="footer-col glass-card shine-hover float-card">
                <h3>Address</h3>
                <p>Yellow brick road 111</p>
                <p>Fantasy Land</p>
                <p>Somewhere</p>
            </div>

            <div class="footer-col glass-card shine-hover float-card">
                <h3>Follow Us</h3>
                <div class="social-icons">
                    <a href="https://www.facebook.com/ssvjeweller" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <i class="bi bi-facebook" aria-hidden="true"></i>
                    </a>
                    <a href="https://www.instagram.com/ssvjeweller" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <i class="bi bi-instagram" aria-hidden="true"></i>
                    </a>
                    <a href="https://www.youtube.com/@ssvjeweller" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                        <i class="bi bi-youtube" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
        </div>

        <div class="footer-divider"></div>

        <div class="footer-bottom">
            <p class="footer-copyright">Copyright awakenedtemplates</p>
            <div class="footer-legal">
                <a href="policies.html">Policies</a>
                <a href="services.html">Terms</a>
            </div>
        </div>
    </div>
</footer>`;

    const mountPoint = document.getElementById('footer-root');

    if (document.querySelector('.site-footer')) {
        return;
    }

    if (mountPoint) {
        mountPoint.innerHTML = footerHTML;
        return;
    }

    document.body.insertAdjacentHTML('beforeend', footerHTML);
})();

