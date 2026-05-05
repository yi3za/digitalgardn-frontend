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

// Config d'un filtre : { key, type: "select"|"input", placeholder?, options?: [{value, labelKey}] }
// Composant generique de barre de filtres avec application differee (bouton Filtrer)
export function FilterBar({ filtersConfig = [], onApply, t }) {
  // Etat local des filtres en attente, non encore appliques
  const [pending, setPending] = useState(() =>
    Object.fromEntries(
      filtersConfig.map((f) => [f.key, f.type === "select" ? ALL_VALUE : ""]),
    ),
  );

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
    <div className="flex flex-wrap items-end gap-2 pb-4">
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
                {filter.allLabel ? t(filter.allLabel) : t("common:filters.all")}
              </SelectItem>
              {(filter.options ?? []).map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label ?? t(opt.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            key={filter.key}
            value={pending[filter.key] ?? ""}
            onChange={(e) => handleChange(filter.key, e.target.value)}
            placeholder={
              filter.placeholder
                ? t(filter.placeholder)
                : t("common:filters.search")
            }
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
