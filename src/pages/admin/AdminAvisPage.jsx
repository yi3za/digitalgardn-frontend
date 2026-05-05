import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminAvis } from "@/features/admin/avis/avis.query";
import { useDeleteAdminAvis } from "@/features/admin/avis/avis.mutations";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import { Trash2, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationBar } from "@/components/shared/PaginationBar";
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
import { AvatarIdentity } from "@/components/shared/AvatarIdentity";
import { ServiceMiniCard } from "@/components/shared/ServiceMiniCard";

// Colonnes du tableau des avis
const COLUMNS = [
  "id",
  "client",
  "freelance",
  "service",
  "note",
  "commentaire",
  "date",
  "actions",
];

// Options de filtre par note (1 a 5 etoiles)
const NOTE_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({
  value: String(n),
  label: `${n} ★`,
}));

// Configuration des filtres disponibles pour les avis
const AVIS_FILTERS_CONFIG = [
  { key: "search", type: "input" },
  { key: "note", type: "select", options: NOTE_OPTIONS },
];

/**
 * Page de gestion des avis (espace admin)
 */
export function AdminAvisPage() {
  // Hook de traduction
  const { t } = useTranslation(["admin", "codes", "common"]);
  // Etat des filtres appliques et de la page courante
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };
  // Requete de recuperation des avis
  const { data, isLoading, isError, isFetching, error, refetch } =
    useAdminAvis({ ...filters, page });
  const avis = data?.items ?? [];
  const meta = data?.meta;
  // Mutation de suppression d'un avis
  const deleteMutation = useDeleteAdminAvis();
  // Code d'erreur ou valeur par defaut
  const code = error?.response?.data?.code ?? "NETWORK_ERROR";
  // Supprime un avis et notifie l'utilisateur
  const handleDelete = async (avisId) => {
    try {
      await deleteMutation.mutateAsync(avisId);
      toast.success(t("codes:SUCCESS"));
    } catch (err) {
      toast.error(t(`codes:${err?.response?.data?.code ?? "NETWORK_ERROR"}`));
    }
  };

  return (
    <Card className="border-0 shadow-none flex-1">
      <AdminPageHeader
        title={t("admin:avis.title")}
        description={t("admin:avis.description")}
        onRefresh={refetch}
        isFetching={isFetching}
      />
      <CardContent className="flex flex-1 flex-col">
        <FilterBar
          t={t}
          filtersConfig={AVIS_FILTERS_CONFIG}
          onApply={handleApplyFilters}
        />
        {isLoading && <DataLoading />}
        {isError && (
          <DataError
            errorCode={code}
            onRetry={refetch}
            retryText={t("common:actions.retry")}
          />
        )}
        {!isLoading && !isError && avis.length === 0 && (
          <DataEmpty description={t("common:states.empty")} />
        )}
        {!isLoading && !isError && avis.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableHead key={col}>
                    {t(`admin:avis.columns.${col}`)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {avis.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold">#{item.id}</TableCell>
                  <TableCell>
                    <AvatarIdentity user={item.client} />
                  </TableCell>
                  <TableCell>
                    <AvatarIdentity user={item.freelance} />
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
                  <TableCell className="max-w-48 truncate text-muted-foreground">
                    {item.commentaire}
                  </TableCell>
                  <TableCell>{formatDateTime(item.created_at)}</TableCell>
                  <TableCell>
                    <ReusableDialog
                      triggerLabel={<Trash2 className="size-3" />}
                      triggerProps={{ size: "sm", variant: "destructive" }}
                      title={t("admin:avis.confirm_delete_title")}
                      description={t("admin:avis.confirm_delete")}
                      confirmLabel={t("admin:avis.actions.delete")}
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
        {!isLoading && !isError && (
          <PaginationBar
            currentPage={meta?.current_page ?? 1}
            lastPage={meta?.last_page ?? 1}
            onPageChange={setPage}
          />
        )}
      </CardContent>
    </Card>
  );
}
