interface LogoProps {
  size?: 'sm' | 'md';
}

/** İzleOku logosu: oynat simgeli yer imi + "İzleOku" yazısı. */
export default function Logo({ size = 'md' }: LogoProps) {
  return (
    <span className={`brand-logo brand-logo-${size}`}>
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M7 3h10a1.5 1.5 0 0 1 1.5 1.5V21L12 17.2 5.5 21V4.5A1.5 1.5 0 0 1 7 3z" fill="currentColor" />
          <path d="M10.5 7.2v6.6l5-3.3z" className="brand-mark-play" />
        </svg>
      </span>
      <span className="brand-text">
        İzle<span className="brand-text-accent">Oku</span>
      </span>
    </span>
  );
}
