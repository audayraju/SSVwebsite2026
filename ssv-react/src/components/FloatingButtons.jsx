export default function FloatingButtons() {
  return (
    <div className="floating-buttons">
      <a
        href="https://wa.me/9177396962"
        target="_blank"
        rel="noopener noreferrer"
        className="float-btn whatsapp"
        aria-label="WhatsApp chat"
      >
        <i className="bi bi-whatsapp" aria-hidden="true" />
      </a>
      <a
        href="tel:+919177396962"
        className="float-btn call"
        aria-label="Call us"
      >
        <i className="bi bi-telephone" aria-hidden="true" />
      </a>
    </div>
  )
}
