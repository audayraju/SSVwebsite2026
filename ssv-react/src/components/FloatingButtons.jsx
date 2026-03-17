export default function FloatingButtons() {
  return (
    <div className="floating-buttons">
      <a
        href="https://wa.me/916281049201"
        target="_blank"
        rel="noopener noreferrer"
        className="float-btn whatsapp"
        aria-label="WhatsApp chat"
      >
        <i className="bi bi-whatsapp" aria-hidden="true" />
      </a>
      <a
        href="tel:+91916281049201"
        className="float-btn call"
        aria-label="Call us"
      >
        <i className="bi bi-telephone" aria-hidden="true" />
      </a>
    </div>
  )
}
