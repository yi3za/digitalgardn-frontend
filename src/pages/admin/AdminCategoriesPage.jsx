import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useAdminCategories,
  useDeleteAdminCategorie,
} from "@/features/admin/categories/categories.query";
import { CategorieFormDialog } from "@/components/admin/CategorieFormDialog";
import { CategorieMiniCard } from "@/components/shared/CategorieMiniCard";
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
} from "@/components/ui";

/**
 * Page de gestion des categories (espace admin)
 */
export function AdminCategoriesPage() {
  // Hook de traduction
  const { t } = useTranslation(["admin", "codes", "common"]);
  // Requete de recuperation des categories
  const {
    data: categories,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useAdminCategories();
  // Mutation de suppression d'une categorie
  const deleteMutation = useDeleteAdminCategorie();
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Categories parentes uniquement (sans parent_id)
  const parents = (categories ?? []).filter((c) => c.parent === null);
  // Suppression d'une categorie par id
  const handleDelete = async (id) => {
    try {
      // Supprimer la categorie et rafraichir la liste
      await deleteMutation.mutateAsync(id);
      toast.success(t("codes:SUCCESS"));
    } catch (err) {
      toast.error(t(`codes:${err?.response?.data?.code ?? "NETWORK_ERROR"}`));
    }
  };

  return (
    <Card className="border-0 shadow-none flex-1">
      <AdminPageHeader
        title={t("admin:categories.title")}
        description={t("admin:categories.description")}
        isFetching={isFetching}
        actions={
          <CategorieFormDialog
            parents={parents}
            triggerLabel={
              <>
                <Plus className="size-4" />
                {t("admin:categories.actions.create")}
              </>
            }
            triggerProps={{ variant: "link" }}
          />
        }
      />
      <CardContent className="flex flex-1">
        {isLoading && <DataLoading />}
        {isError && (
          <DataError
            errorCode={code}
            onRetry={refetch}
            retryText={t("common:actions.retry")}
          />
        )}
        {!isLoading && !isError && categories.length === 0 && (
          <DataEmpty description={t("common:states.empty")} />
        )}
        {!isLoading && !isError && categories.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {["categorie", "parent", "ordre", "statut", "actions"].map(
                  (col) => (
                    <TableHead key={col}>
                      {t(`admin:categories.columns.${col}`)}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((categorie) => (
                <TableRow key={categorie.id}>
                  <TableCell className="font-medium">
                    <CategorieMiniCard categorie={categorie} />
                  </TableCell>
                  <TableCell>
                    {categorie.parent ? (
                      <CategorieMiniCard categorie={categorie.parent} />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{categorie.ordre}</TableCell>
                  <TableCell>
                    <Badge
                      variant={categorie.est_active ? "default" : "secondary"}
                    >
                      {t(
                        categorie.est_active
                          ? "admin:categories.statuts.active"
                          : "admin:categories.statuts.inactive",
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 [&_button]:flex-1">
                      <CategorieFormDialog
                        categorie={categorie}
                        parents={parents}
                        triggerLabel={<Pencil className="size-3" />}
                        triggerProps={{ size: "sm", variant: "outline" }}
                      />
                      <ReusableDialog
                        triggerLabel={<Trash2 className="size-3" />}
                        triggerProps={{ size: "sm", variant: "destructive" }}
                        title={t("admin:categories.confirm_delete_title")}
                        description={t("admin:categories.confirm_delete", {
                          nom: categorie.nom,
                        })}
                        confirmLabel={t("admin:categories.actions.delete")}
                        cancelLabel={t("common:actions.cancel")}
                        confirmVariant="destructive"
                        onConfirm={() => handleDelete(categorie.id)}
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
      </CardContent>
    </Card>
  );
}
