import { useTranslation } from "react-i18next";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { QueryItemsSection } from "@/components/shared/QueryItemsSection";
import { AvatarIdentity } from "@/components/shared/AvatarIdentity";
import { ServiceMiniCard } from "@/components/shared/ServiceMiniCard";
import { buildMyAvisFiltersConfig } from "@/features/account/avis/avis.filters";
import { useDeleteMyAvis } from "@/features/account/avis/avis.mutations";
import { useMyAvis } from "@/features/account/avis/avis.query";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { formatDateTime } from "@/lib/utils";
import {
  ReusableDialog,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Colonnes du tableau des avis recus
const COLUMNS = ["client", "service", "note", "commentaire", "date", "actions"];

/**
 * Page des avis recus par le freelance connecte
 */
export function AvisPage() {
  // Traduction
  const { t } = useTranslation(["dashboard", "common", "codes"]);
  // Gestion des filtres et de la pagination dans l'URL
  const [filters, handleApplyFilters, page, setPage] = useUrlFilters({
    keys: ["search", "note"],
  });
  // Recuperation des avis recus par le freelance connecte avec les filtres et la pagination
  const avisQuery = useMyAvis({ ...filters, page });
  const meta = avisQuery.data?.meta;
  // Mutation de suppression d'un avis recu
  const deleteMutation = useDeleteMyAvis();
  // Supprime un avis recu par le freelance connecte
  const handleDelete = async (avisId) => {
    try {
      await deleteMutation.mutateAsync(avisId);
      toast.success(t("codes:SUCCESS"));
    } catch (err) {
      toast.error(t(`codes:${err?.response?.data?.code ?? "NETWORK_ERROR"}`));
    }
  };

  return (
    <QueryItemsSection
      itemsQuery={avisQuery}
      title={t("dashboard:avis.title")}
      description={t("dashboard:avis.description")}
      filterBar={
        <FilterBar
          t={t}
          filtersConfig={buildMyAvisFiltersConfig(t)}
          onApply={handleApplyFilters}
          initialValues={filters}
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
      renderItems={(avis) => (
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableHead key={col}>
                  {t(`dashboard:avis.columns.${col}`)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {avis.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <AvatarIdentity user={item.client} />
                </TableCell>
                <TableCell>
                  {item.service && <ServiceMiniCard service={item.service} />}
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 font-medium">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    {item.note}
                  </span>
                </TableCell>
                <TableCell className="max-w-64 truncate text-muted-foreground">
                  {item.commentaire}
                </TableCell>
                <TableCell>{formatDateTime(item.created_at)}</TableCell>
                <TableCell>
                  <ReusableDialog
                    triggerLabel={<Trash2 className="size-3" />}
                    triggerProps={{ size: "sm", variant: "destructive" }}
                    title={t("dashboard:avis.confirm_delete_title")}
                    description={t("dashboard:avis.confirm_delete")}
                    confirmLabel={t("dashboard:avis.actions.delete")}
                    cancelLabel={t("common:actions.cancel")}
                    confirmVariant="destructive"
                    onConfirm={() => handleDelete(item.id)}
                    loading={deleteMutation.isPending}
                    disabled={deleteMutation.isPending}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    />
  );
}
