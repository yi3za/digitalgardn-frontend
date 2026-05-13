import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { Button, ScrollArea } from "@/components/ui";
import { PortefeuilleSummaryCard } from "@/components/portefeuille/PortefeuilleSummaryCard";
import { TransactionsRechargeDialog } from "@/components/portefeuille/TransactionsRechargeDialog";
import { TransactionRow } from "@/components/portefeuille/TransactionRow";
import { usePortefeuille } from "@/features/account/portefeuille/portefeuille.query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ListSkeleton } from "@/components/skeletons";

/**
 * Page principale du portefeuille qui affiche le solde et les 10 dernieres transactions
 */
export function PortefeuillePage() {
  // Hook de traduction pour les textes de la page et les codes d'erreur
  const { t } = useTranslation(["profil", "common"]);
  // Requete unique : le portefeuille inclut les 10 dernieres transactions
  const portefeuilleQuery = usePortefeuille();
  // Query adaptee pour QueryItemsSection : pointe vers le tableau de transactions
  const transactionsQuery = {
    ...portefeuilleQuery,
    data: portefeuilleQuery.data?.transactions ?? [],
  };

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
        loadingSkeleton={ListSkeleton}
        loadingSkeletonProps={{ avatar: false, actions: true }}
        renderItems={(transactions) => (
          <ScrollArea className="h-100 px-5">
            <>
              {transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  t={t}
                />
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
