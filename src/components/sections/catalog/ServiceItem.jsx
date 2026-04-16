import {
  Item,
  ItemContent,
  ItemTitle,
  ItemHeader,
  ItemDescription,
  ItemActions,
} from "@/components/ui";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Composant qui affiche un service individuel dans le catalogue
 */
export function ServiceItem({ item, linkTo = "/services", dashboard = false }) {
  // Hook de navigation
  const navigate = useNavigate();
  // Fonction pour naviguer vers la page
  const handleClick = () => {
    navigate(`${linkTo}/${item.slug}`);
  };
  // Fonction pour naviguer vers la page de modification de service
  const handleEditService = () => {
    navigate(`${linkTo}/${item.slug}/edit`);
  };

  return (
    <Item
      className="hover:shadow transition-shadow overflow-hidden flex-nowrap flex-col"
      variant="outline"
    >
      <ItemHeader className="h-50 cursor-pointer" onClick={handleClick}>
        <img
          src={item?.fichierPrincipale?.chemin_url}
          alt={item?.titre}
          title={item?.titre}
          className="w-full h-full rounded"
        />
      </ItemHeader>
      <ItemContent>
        <ItemTitle className="line-clamp-1">{item?.titre}</ItemTitle>
        <ItemDescription>{item?.description}</ItemDescription>
      </ItemContent>
      {dashboard && (
        <ItemActions className="gap-5 justify-evenly w-full bg-muted p-2 rounded">
          <Eye className="block text-blue-500 hover:text-blue-700 cursor-pointer" />
          <Pencil
            onClick={handleEditService}
            className="block text-amber-500 hover:text-amber-700 cursor-pointer"
          />
          <Trash2 className="block text-red-600 hover:text-red-800 cursor-pointer" />
        </ItemActions>
      )}
    </Item>
  );
}
