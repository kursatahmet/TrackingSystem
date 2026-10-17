interface RatingStarsProps {
  rating?: number;
}

/** Puanı 5 yıldız üzerinden gösterir. Puan yoksa "—" görünür. */
export default function RatingStars({ rating }: RatingStarsProps) {
  if (rating === undefined) {
    return <span className="text-muted-green" aria-label="Puan verilmemiş">—</span>;
  }

  return (
    <span className="rating-stars" role="img" aria-label={`5 üzerinden ${rating} puan`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i key={star} className={`bi ${star <= rating ? 'bi-star-fill' : 'bi-star'}`} aria-hidden="true" />
      ))}
    </span>
  );
}
