import { useCommande } from "@/features/account/commandes/commandes.query";
import { useParams } from "react-router-dom";

export function CommandesShowPage() {
  // Recuperation de l'id de la commande depuis les params de l'url
  const { id } = useParams();
  // Requete pour recuperer les details de la commande
  const commande = useCommande(id);

  return <div>CommandesShowPage {id}</div>;
}
