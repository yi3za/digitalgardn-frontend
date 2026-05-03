import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useAdminCompetences,
  useDeleteAdminCompetence,
} from "@/features/admin/competences/competences.query";
import { CompetenceFormDialog } from "@/components/admin/CompetenceFormDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  CardAction,
  ReusableDialog,
} from "@/components/ui";

/**
 * Page de gestion des competences (espace admin)
 */
export function AdminCompetencesPage() {
  // Hook de traduction
  const { t } = useTranslation(["admin", "codes", "common"]);
  // Requete de recuperation des competences
  const {
    data: competences,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminCompetences();
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

  return (
    <Card className="border-0 shadow-none flex-1">
      <CardHeader>
        <CardTitle>{t("admin:competences.title")}</CardTitle>
        <CardDescription>{t("admin:competences.description")}</CardDescription>
        <CardAction>
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
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1">
        {isLoading && <DataLoading />}
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
                {["nom", "slug", "parent", "ordre", "statut", "actions"].map(
                  (col) => (
                    <TableHead key={col}>
                      {t(`admin:competences.columns.${col}`)}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {competences.map((comp) => (
                <TableRow key={comp.id}>
                  <TableCell>{comp.nom}</TableCell>
                  <TableCell>{comp.slug}</TableCell>
                  <TableCell>{comp.parent?.nom ?? "—"}</TableCell>
                  <TableCell>{comp.ordre}</TableCell>
                  <TableCell>
                    <Badge variant={comp.est_active ? "default" : "secondary"}>
                      {t(
                        comp.est_active
                          ? "admin:competences.statuts.active"
                          : "admin:competences.statuts.inactive",
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 [&_button]:flex-1">
                      {/* Dialog edition avec trigger Pencil */}
                      <CompetenceFormDialog
                        competence={comp}
                        parents={parents}
                        triggerLabel={<Pencil className="size-3" />}
                        triggerProps={{ size: "sm", variant: "outline" }}
                      />
                      {/* Dialog confirmation suppression avec trigger Trash */}
                      <ReusableDialog
                        triggerLabel={<Trash2 className="size-3" />}
                        triggerProps={{ size: "sm", variant: "destructive" }}
                        title={t("admin:competences.confirm_delete_title")}
                        description={t("admin:competences.confirm_delete", {
                          nom: comp.nom,
                        })}
                        confirmLabel={t("admin:competences.actions.delete")}
                        cancelLabel={t("common:actions.cancel")}
                        confirmVariant="destructive"
                        onConfirm={() => handleDelete(comp.id)}
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
