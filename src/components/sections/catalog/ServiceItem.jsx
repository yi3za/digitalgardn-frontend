import {
  Item,
  ItemContent,
  ItemTitle,
  ItemHeader,
  ItemDescription,
  ItemMedia,
  ItemActions,
  Button,
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

  return dashboard ? (
    <Item variant="outline">
      <ItemMedia className="h-20">
        <img
          src={item?.fichierPrincipale?.chemin_url}
          alt={item?.titre}
          title={item?.titre}
          className="w-full h-full rounded"
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{item?.titre}</ItemTitle>
      </ItemContent>
      <ItemActions className="gap-5 justify-between">
        <Eye className="block text-blue-500 hover:text-blue-700 cursor-pointer" />
        <Pencil
          onClick={handleEditService}
          className="block text-amber-500 hover:text-amber-700 cursor-pointer"
        />
        <Trash2 className="block text-red-600 hover:text-red-800 cursor-pointer" />
      </ItemActions>
    </Item>
  ) : (
    <Item
      className="cursor-pointer hover:shadow transition-shadow overflow-hidden"
      variant="outline"
      onClick={handleClick}
    >
      <ItemHeader className="h-50">
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
    </Item>
  );
}
