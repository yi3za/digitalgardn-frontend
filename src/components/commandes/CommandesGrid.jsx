import { ItemGroup } from "../ui";
import { CommandeItem } from "./CommandeItem";

/**
 * Grille des commandes
 */
export function CommandesGrid({ t, commandes = [], linkTo = "/commandes" }) {
  return (
    <ItemGroup className="gap-3">
      {commandes.map((commande) => (
        <CommandeItem key={commande.id} item={commande} linkTo={linkTo} t={t} />
      ))}
    </ItemGroup>
  );
}
