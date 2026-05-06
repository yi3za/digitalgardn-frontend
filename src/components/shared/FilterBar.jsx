import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useState } from "react";

// Valeur sentinelle pour le select "Tous" (evite les problemes avec la valeur vide dans Radix)
const ALL_VALUE = "all";

/**
 * Composant de barre de filtres generique. Accepte une configuration de filtres (type input ou select) et notifie le parent des changements
 */
export function FilterBar({
  filtersConfig = [],
  onApply,
  t,
  initialValues = {},
}) {
  // Etat local des filtres en attente, non encore appliques
  const [pending, setPending] = useState(() =>
    Object.fromEntries(
      filtersConfig.map((f) => [
        f.key,
        initialValues[f.key] ?? (f.type === "select" ? ALL_VALUE : ""),
      ]),
    ),
  );
  // Met a jour un filtre dans l'etat local
  const handleChange = (key, value) =>
    setPending((prev) => ({ ...prev, [key]: value }));
  // Applique les filtres en supprimant les valeurs vides ou "all"
  const handleApply = () => {
    const active = Object.fromEntries(
      Object.entries(pending).filter(
        ([, v]) => v !== ALL_VALUE && v !== "" && v != null,
      ),
    );
    onApply(active);
  };
  // Reinitialise tous les filtres et notifie immediatement le parent
  const handleReset = () => {
    setPending(
      Object.fromEntries(
        filtersConfig.map((f) => [f.key, f.type === "select" ? ALL_VALUE : ""]),
      ),
    );
    onApply({});
  };

  return (
    <div className="pb-4 flex flex-wrap items-center gap-2">
      {filtersConfig.map((filter) =>
        filter.type === "select" ? (
          <Select
            key={filter.key}
            value={pending[filter.key] ?? ALL_VALUE}
            onValueChange={(val) => handleChange(filter.key, val)}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>
                {filter.allLabel
                  ? t("common:filters.all_label", { label: filter.allLabel })
                  : t("common:filters.all")}
              </SelectItem>
              {(filter.options ?? []).map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            key={filter.key}
            value={pending[filter.key] ?? ""}
            onChange={(e) => handleChange(filter.key, e.target.value)}
            placeholder={filter.placeholder ?? t("common:filters.search")}
            className="w-44"
          />
        ),
      )}
      <Button size="sm" onClick={handleApply}>
        {t("common:filters.apply")}
      </Button>
      <Button size="sm" variant="outline" onClick={handleReset}>
        {t("common:actions.reset")}
      </Button>
    </div>
  );
}
