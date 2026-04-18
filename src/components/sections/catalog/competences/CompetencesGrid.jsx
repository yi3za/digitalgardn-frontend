import { ScrollArea, ScrollBar } from "@/components/ui";
import { CompetenceItem } from "./CompetenceItem";

/**
 * Grille horizontale des competences pour la page d'accueil
 */
export function CompetencesGrid({ competences = [], linkTo = "/competences" }) {
  return (
    <ScrollArea>
      <div className="flex gap-4 mb-8">
        {competences.map((competence) => (
          <CompetenceItem
            key={competence.id}
            item={competence}
            linkTo={linkTo}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
