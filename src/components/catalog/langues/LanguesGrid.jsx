import { LangueItem } from "./LangueItem";

/**
 * Grille des langues
 */
export function LanguesGrid({ langues = [] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {langues.map((langue) => (
        <LangueItem key={langue.id} item={langue} />
      ))}
    </div>
  );
}
