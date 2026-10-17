import { useState } from 'react';

interface RatingInputProps {
  id: string;
  value: number | null;
  onChange: (value: number | null) => void;
  invalid?: boolean;
  describedBy?: string;
}

/** 1-5 arası yıldız seçici. Puan opsiyoneldir, "Temizle" ile kaldırılabilir. */
export default function RatingInput({ id, value, onChange, invalid, describedBy }: RatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const shown = hovered ?? value ?? 0;

  return (
    <div className={`rating-input${invalid ? ' is-invalid' : ''}`} onMouseLeave={() => setHovered(null)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          id={star === 1 ? id : undefined}
          type="button"
          className={`rating-input-star${star <= shown ? ' filled' : ''}`}
          aria-label={`${star} puan`}
          aria-pressed={value === star}
          aria-describedby={describedBy}
          onMouseEnter={() => setHovered(star)}
          onClick={() => onChange(star)}
        >
          <i className={`bi ${star <= shown ? 'bi-star-fill' : 'bi-star'}`} aria-hidden="true" />
        </button>
      ))}
      <span className="rating-input-text">{value ? `${value} / 5` : 'Puan verilmedi'}</span>
      {value !== null && (
        <button type="button" className="btn-link-custom" onClick={() => onChange(null)}>
          Temizle
        </button>
      )}
    </div>
  );
}
