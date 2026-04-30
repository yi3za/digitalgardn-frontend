import { ScrollArea, ScrollBar } from "@/components/ui";
import { CompetenceItem } from "./CompetenceItem";

/**
 * Grille des competences : scroll (horizontal) ou grid
 */
export function CompetencesGrid({
  competences = [],
  linkTo = "/competences",
  variant = "scroll",
}) {
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {competences.map((competence) => (
          <CompetenceItem
            key={competence.id}
            item={competence}
            linkTo={linkTo}
          />
        ))}
      </div>
    );
  }

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
