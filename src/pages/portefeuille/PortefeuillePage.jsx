import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { Button, ScrollArea } from "@/components/ui";
import { PortefeuilleSummaryCard } from "@/components/portefeuille/PortefeuilleSummaryCard";
import { TransactionsRechargeDialog } from "@/components/portefeuille/TransactionsRechargeDialog";
import { TransactionRow } from "@/components/portefeuille/TransactionRow";
import {
  usePortefeuille,
  usePortefeuilleTransactions,
} from "@/features/account/portefeuille/portefeuille.query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * Page principale du portefeuille qui affiche le solde et les transactions recentes
 */
export function PortefeuillePage() {
  // Hook de traduction pour les textes de la page et les codes d'erreur
  const { t } = useTranslation(["profil", "common"]);
  // Requetes pour recuperer les donnees du portefeuille et de ses transactions
  const portefeuilleQuery = usePortefeuille();
  const transactionsQuery = usePortefeuilleTransactions();

  return (
    <div className="space-y-6">
      <PortefeuilleSummaryCard
        portefeuilleQuery={portefeuilleQuery}
        action={<TransactionsRechargeDialog />}
      />
      <QueryItemsSection
        itemsQuery={transactionsQuery}
        title={t("profil:portefeuille.transactions.title")}
        description={t("profil:portefeuille.transactions.pageDescription")}
        emptyDescription={t("profil:portefeuille.transactions.empty")}
        renderItems={(transactions) => (
          <ScrollArea className="h-100 px-5">
            <>
              {transactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} t={t} />
              ))}
            </>
          </ScrollArea>
        )}
        action={
          <Button asChild variant="link">
            <Link to="transactions">
              {t("common:actions.viewAll")}
              <ArrowRight />
            </Link>
          </Button>
        }
      />
    </div>
  );
}
