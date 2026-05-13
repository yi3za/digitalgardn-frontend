import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { TransactionRow } from "@/components/portefeuille/TransactionRow";
import { usePortefeuilleTransactions } from "@/features/account/portefeuille/portefeuille.query";
import { buildTransactionsFiltersConfig } from "@/features/account/portefeuille/portefeuille.filters";
import { useTranslation } from "react-i18next";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { ListSkeleton } from "@/components/skeletons";

/**
 * Page des transactions du portefeuille
 */
export function TransactionsPage() {
  // Hook de traduction pour les textes de la page et les codes d'erreur
  const { t } = useTranslation(["profil", "common"]);
  // Utiliser le hook de synchronisation des filtres avec l'URL
  const [filters, handleApplyFilters, page, setPage] = useUrlFilters({
    keys: ["type"],
  });
  // Requetes pour recuperer les donnees du portefeuille et de ses transactions
  const transactionsQuery = usePortefeuilleTransactions({ ...filters, page });
  const meta = transactionsQuery.data?.meta;

  return (
    <QueryItemsSection
      itemsQuery={transactionsQuery}
      title={t("profil:portefeuille.transactions.title")}
      description={t("profil:portefeuille.transactions.pageDescription")}
      emptyDescription={t("profil:portefeuille.transactions.empty")}
      loadingSkeleton={ListSkeleton}
      loadingSkeletonProps={{ avatar: false, actions: true }}
      filterBar={
        <FilterBar
          t={t}
          filtersConfig={buildTransactionsFiltersConfig(t)}
          onApply={handleApplyFilters}
          initialValues={filters}
          onRefetch={transactionsQuery.refetch}
        />
      }
      paginationBar={
        (meta?.last_page ?? 0) > 1 ? (
          <PaginationBar
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={setPage}
          />
        ) : null
      }
      renderItems={(transactions) => (
        <div>
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              t={t}
            />
          ))}
        </div>
      )}
    />
  );
}
