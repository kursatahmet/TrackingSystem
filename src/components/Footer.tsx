const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer-custom">
      <div className="footer-left">
        <span className="footer-logo">İzleOku</span>
        <span className="footer-separator">|</span>
        <span className="footer-copy">
          © {CURRENT_YEAR} · Tasarım:{' '}
          <a href="https://themewagon.com/themes/spark/" target="_blank" rel="noopener noreferrer">
            Spark by ThemeWagon
          </a>
        </span>
      </div>
      <div className="footer-right">
        <span className="footer-note">
          <i className="bi bi-hdd" aria-hidden="true" /> Veriler yalnızca bu tarayıcıda saklanır
        </span>
      </div>
    </footer>
  );
}
