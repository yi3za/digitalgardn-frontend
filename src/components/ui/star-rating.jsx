import { Star } from "lucide-react";
import { useState } from "react";

/**
 * Composant pour selectionner une note avec des etoiles
 */
export function StarRating({ value, onChange, disabled, count = 5 }) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex gap-2">
      {Array.from({ length: count }).map((_, index) => {
        const ratingValue = index + 1;
        const isFilled = ratingValue <= (hoverValue || value);

        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(ratingValue)}
            onMouseEnter={() => !disabled && setHoverValue(ratingValue)}
            onMouseLeave={() => setHoverValue(0)}
            disabled={disabled}
            className="focus:outline-none transition-transform hover:scale-110 disabled:cursor-not-allowed"
          >
            <Star
              className={`size-8 transition-all ${
                isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
