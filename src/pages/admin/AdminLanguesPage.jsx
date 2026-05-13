import { useTranslation } from "react-i18next";
import { TableSkeleton } from "@/components/skeletons";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useAdminLangues,
  useDeleteAdminLangue,
} from "@/features/admin/langues/langues.query";
import { LangueFormDialog } from "@/components/admin/LangueFormDialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  Card,
  CardContent,
  DataLoading,
  DataError,
  DataEmpty,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  ReusableDialog,
} from "@/components/ui";
import { FilterBar } from "@/components/shared/FilterBar";
import { buildAdminLanguesFiltersConfig } from "@/features/admin/langues/langues.filters";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { useUrlFilters } from "@/hooks/useUrlFilters";

/**
 * Page de gestion des langues (espace admin)
 */
export function AdminLanguesPage() {
  // Hook de traduction
  const { t } = useTranslation(["admin", "codes", "common"]);
  // Utiliser le hook de synchronisation des filtres avec l'URL
  const [filters, handleApplyFilters, page, setPage] = useUrlFilters();
  // Requete de recuperation des langues
  const {
    data: { items: langues, meta } = {},
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useAdminLangues({ ...filters, page });
  // Mutation de suppression d'une langue
  const deleteMutation = useDeleteAdminLangue();
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Suppression d'une langue par id
  const handleDelete = async (id) => {
    try {
      // Supprimer la langue et rafraichir la liste
      await deleteMutation.mutateAsync(id);
      toast.success(t("codes:SUCCESS"));
    } catch (err) {
      toast.error(t(`codes:${err?.response?.data?.code ?? "NETWORK_ERROR"}`));
    }
  };

  return (
    <Card className="border-0 shadow-none flex-1">
      <AdminPageHeader
        title={t("admin:langues.title")}
        description={t("admin:langues.description")}
        isFetching={isFetching}
        actions={
          <LangueFormDialog
            triggerLabel={
              <>
                <Plus className="size-4" />
                {t("admin:langues.actions.create")}
              </>
            }
            triggerProps={{ variant: "link" }}
          />
        }
      />
      <CardContent className="flex flex-col flex-1">
        <FilterBar
          t={t}
          filtersConfig={buildAdminLanguesFiltersConfig()}
          onApply={handleApplyFilters}
          initialValues={filters}
        />
        {isLoading && (
          <DataLoading
            skeleton={TableSkeleton}
            skeletonProps={{ columns: 2 }}
          />
        )}
        {isError && (
          <DataError
            errorCode={code}
            onRetry={refetch}
            retryText={t("common:actions.retry")}
          />
        )}
        {!isLoading && !isError && langues.length === 0 && (
          <DataEmpty description={t("common:states.empty")} />
        )}
        {!isLoading && !isError && langues.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {["langue", "actions"].map((col) => (
                  <TableHead key={col}>
                    {t(`admin:langues.columns.${col}`)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {langues.map((langue) => (
                <TableRow key={langue.id}>
                  <TableCell>{langue.nom}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 [&_button]:flex-1">
                      <LangueFormDialog
                        langue={langue}
                        triggerLabel={<Pencil className="size-3" />}
                        triggerProps={{ size: "sm", variant: "outline" }}
                      />
                      <ReusableDialog
                        triggerLabel={<Trash2 className="size-3" />}
                        triggerProps={{ size: "sm", variant: "destructive" }}
                        title={t("admin:langues.confirm_delete_title")}
                        description={t("admin:langues.confirm_delete", {
                          nom: langue.nom,
                        })}
                        confirmLabel={t("admin:langues.actions.delete")}
                        cancelLabel={t("common:actions.cancel")}
                        confirmVariant="destructive"
                        onConfirm={() => handleDelete(langue.id)}
                        loading={deleteMutation.isPending}
                        disabled={deleteMutation.isPending}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!isLoading && !isError && (
          <PaginationBar
            currentPage={meta?.current_page}
            lastPage={meta?.last_page}
            onPageChange={setPage}
          />
        )}
      </CardContent>
    </Card>
  );
}
