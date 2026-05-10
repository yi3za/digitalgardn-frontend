// Config des filtres pour la page de gestion des avis admin
export const buildAdminAvisFiltersConfig = (t) => [
  { key: "search", type: "input" },
  {
    key: "note",
    type: "select",
    allLabel: t("admin:avis.filters.note_label"),
    options: [1, 2, 3, 4, 5].map((n) => ({
      value: String(n),
      label: `${n} ★`,
    })),
  },
];
