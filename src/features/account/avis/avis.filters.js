// Config des filtres pour la page des avis recus
export const buildMyAvisFiltersConfig = (t) => [
  { key: "search", type: "input" },
  {
    key: "note",
    type: "select",
    allLabel: t("dashboard:avis.filters.note_label"),
    options: [1, 2, 3, 4, 5].map((n) => ({
      value: String(n),
      label: `${n} ★`,
    })),
  },
];
