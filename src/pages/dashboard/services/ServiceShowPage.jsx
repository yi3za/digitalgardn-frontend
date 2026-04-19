import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { ServiceDetailsCard } from "@/components/shared/ServiceDetailsCard";
import { useMyService } from "@/features/freelance/catalog/services/services.query";
import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

/**
 * Page d'affichage d'un service dans le dashboard freelance, permettant de voir les details du service et d'acceder a son edition
 */
export function ServiceShowPage() {
  // Recuperation du slug du service dans les params d'URL pour charger le service correspondant
  const { slug } = useParams();
  // Hook de navigation
  const navigate = useNavigate();
  // Hook de traduction pour les textes statiques de la page
  const { t } = useTranslation(["dashboard", "sections", "codes"]);
  // Requete pour recuperer les informations du service
  const {
    data: service,
    isLoading,
    isError,
    error,
    refetch,
  } = useMyService(slug);

  return (
    <Card className="shadow-none rounded-none border-none flex-1">
      <CardHeader>
        <CardTitle>{t("services.show.title")}</CardTitle>
        <CardDescription>{t("services.show.description")}</CardDescription>
        <CardAction>
          <Button
            variant="link"
            onClick={() =>
              navigate(`/dashboard/services/${service?.slug}/edit`)
            }
          >
            <Pencil />
            {t("services.show.actions.edit")}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <ServiceDetailsCard
          service={service}
          isLoading={isLoading}
          isError={isError}
          error={error}
          refetch={refetch}
          t={t}
          showStatus={true}
        />
      </CardContent>
    </Card>
  );
}
