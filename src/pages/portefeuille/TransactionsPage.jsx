import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { Button } from "@/components/ui";
import { TransactionRow } from "@/components/portefeuille/TransactionRow";
import { usePortefeuilleTransactions } from "@/features/account/portefeuille/portefeuille.query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * Page des transactions du portefeuille
 */
export function TransactionsPage() {
  // Hook de traduction pour les textes de la page et les codes d'erreur
  const { t } = useTranslation(["profil", "common"]);
  // Requetes pour recuperer les donnees du portefeuille et de ses transactions
  const transactionsQuery = usePortefeuilleTransactions();
  // Hook de navigation pour le bouton de retour
  const navigate = useNavigate();

  return (
    <QueryItemsSection
      itemsQuery={transactionsQuery}
      title={t("profil:portefeuille.transactions.title")}
      description={t("profil:portefeuille.transactions.pageDescription")}
      emptyDescription={t("profil:portefeuille.transactions.empty")}
      renderItems={(transactions) => (
        <div>
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} t={t} />
          ))}
        </div>
      )}
      action={
        <Button variant="link" onClick={() => navigate(-1)}>
          <ArrowLeft />
          {t("common:actions.back")}
        </Button>
      }
    />
  );
}
