import { useTranslation } from "react-i18next";
import { TableSkeleton } from "@/components/skeletons";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ChevronRight } from "lucide-react";
import {
  useAdminCompetences,
  useDeleteAdminCompetence,
} from "@/features/admin/competences/competences.query";
import { CompetenceFormDialog } from "@/components/admin/CompetenceFormDialog";
import { CompetenceMiniCard } from "@/components/shared/CompetenceMiniCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  Card,
  CardContent,
  Badge,
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
  Button,
} from "@/components/ui";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { buildAdminCompetencesFiltersConfig } from "@/features/admin/competences/competences.filters";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { FilterBar } from "@/components/shared/FilterBar";

/**
 * Page de gestion des competences (espace admin)
 */
export function AdminCompetencesPage() {
  // Hook de traduction
  const { t } = useTranslation(["admin", "codes", "common"]);
  // Utiliser le hook de synchronisation des filtres avec l'URL
  const [filters, handleApplyFilters, page, setPage] = useUrlFilters({
    keys: ["search", "statut"],
  });
  // Etat d'affichage des competences enfants dans la table
  const [showChildren, setShowChildren] = useState({});
  // Requete de recuperation des competences
  const {
    data: { items: competences, meta } = {},
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useAdminCompetences({ ...filters, page });
  // Mutation de suppression d'une competence
  const deleteMutation = useDeleteAdminCompetence();
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Competences parentes uniquement (sans parent_id)
  const parents = (competences ?? []).filter((c) => c.parent_id === null);
  // Suppression d'une competence par id
  const handleDelete = async (id) => {
    try {
      // Supprimer la competence et rafraichir la liste
      await deleteMutation.mutateAsync(id);
      toast.success(t("codes:SUCCESS"));
    } catch (err) {
      toast.error(t(`codes:${err?.response?.data?.code ?? "NETWORK_ERROR"}`));
    }
  };
  // Gestion de l'affichage des competences enfants
  const handleShowChildren = (id) => {
    setShowChildren((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card className="border-0 shadow-none flex-1">
      <AdminPageHeader
        title={t("admin:competences.title")}
        description={t("admin:competences.description")}
        isFetching={isFetching}
        actions={
          <CompetenceFormDialog
            parents={parents}
            triggerLabel={
              <>
                <Plus className="size-4" />
                {t("admin:competences.actions.create")}
              </>
            }
            triggerProps={{ variant: "link" }}
          />
        }
      />
      <CardContent className="flex flex-col flex-1">
        <FilterBar
          t={t}
          filtersConfig={buildAdminCompetencesFiltersConfig(t)}
          onApply={handleApplyFilters}
          initialValues={filters}
          onRefetch={refetch}
        />
        {isLoading && (
          <DataLoading
            skeleton={TableSkeleton}
            skeletonProps={{ columns: 5 }}
          />
        )}
        {isError && (
          <DataError
            errorCode={code}
            onRetry={refetch}
            retryText={t("common:actions.retry")}
          />
        )}
        {!isLoading && !isError && competences.length === 0 && (
          <DataEmpty description={t("common:states.empty")} />
        )}
        {!isLoading && !isError && competences.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {["competence", "parent", "ordre", "statut", "actions"].map(
                  (col) => (
                    <TableHead key={col}>
                      {t(`admin:competences.columns.${col}`)}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {competences.map(
                (competence) =>
                  (!competence.parent ||
                    showChildren[competence.parent.id]) && (
                    <TableRow
                      key={competence.id}
                      className={cn(
                        !competence.parent && showChildren[competence.id]
                          ? "bg-muted"
                          : "",
                      )}
                    >
                      <TableCell>
                        <CompetenceMiniCard competence={competence} />
                      </TableCell>
                      <TableCell>
                        {competence.parent ? (
                          <CompetenceMiniCard competence={competence.parent} />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>{competence.ordre}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            competence.est_active ? "default" : "secondary"
                          }
                        >
                          {t(
                            competence.est_active
                              ? "admin:competences.statuts.active"
                              : "admin:competences.statuts.inactive",
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 [&_button]:flex-1">
                          {!competence.parent && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleShowChildren(competence.id)}
                            >
                              <ChevronRight
                                className={cn(
                                  "transition-transform duration-100",
                                  showChildren[competence.id]
                                    ? "rotate-90"
                                    : "rotate-0",
                                )}
                              />
                            </Button>
                          )}
                          <CompetenceFormDialog
                            competence={competence}
                            parents={parents}
                            triggerLabel={<Pencil className="size-3" />}
                            triggerProps={{ size: "sm", variant: "outline" }}
                          />
                          <ReusableDialog
                            triggerLabel={<Trash2 className="size-3" />}
                            triggerProps={{
                              size: "sm",
                              variant: "destructive",
                            }}
                            title={t("admin:competences.confirm_delete_title")}
                            description={t("admin:competences.confirm_delete", {
                              nom: competence.nom,
                            })}
                            confirmLabel={t("admin:competences.actions.delete")}
                            cancelLabel={t("common:actions.cancel")}
                            confirmVariant="destructive"
                            onConfirm={() => handleDelete(competence.id)}
                            loading={deleteMutation.isPending}
                            disabled={deleteMutation.isPending}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ),
              )}
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
