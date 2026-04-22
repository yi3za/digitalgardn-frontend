import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataError,
  DataLoading,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

// Definition des items a afficher dans le resume du portefeuille
const PORTEFEUILLE_SUMMARY_ITEMS = [
  {
    labelKey: "profil:portefeuille.available",
    valueKey: "solde_disponible",
  },
  {
    labelKey: "profil:portefeuille.pending",
    valueKey: "solde_en_attente",
  },
  {
    labelKey: "profil:portefeuille.total",
    valueKey: "solde_total",
  },
];

/**
 * Carte resume du portefeuille
 */
export function PortefeuilleSummaryCard({ portefeuilleQuery, action = null }) {
  const { t } = useTranslation(["profil", "common", "codes"]);
  // Destructuration des donnees et etats de la requete
  const {
    data: portefeuille,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
  } = portefeuilleQuery;
  // Recuperation du code d'erreur ou valeur par defaut NETWORK_ERROR
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";

  return (
    <Card className="shadow-none rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Wallet className="size-5 text-muted-foreground" />
          {t("profil:portefeuille.title")}
        </CardTitle>
        <CardDescription>
          {t("profil:portefeuille.description")}
        </CardDescription>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent>
        {isLoading && <DataLoading />}
        {isError && (
          <DataError
            errorCode={code}
            retryText={t("common:actions.retry")}
            onRetry={refetch}
          />
        )}
        {isSuccess && (
          <ItemGroup className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PORTEFEUILLE_SUMMARY_ITEMS.map(({ labelKey, valueKey }) => (
              <Item key={labelKey} variant="muted">
                <ItemContent>
                  <ItemDescription>{t(labelKey)}</ItemDescription>
                  <ItemTitle>
                    {formatPrice(portefeuille?.[valueKey] ?? 0)}{" "}
                    {portefeuille?.devise}
                  </ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
}
