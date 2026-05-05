import { ACCOUNT_STATUS, AUTH_ROLE } from "@/features/auth/auth.constants";

// Config des filtres pour la page de gestion des utilisateurs
export const buildUsersFiltersConfig = (t) => [
  { key: "search", type: "input" },
  {
    key: "status",
    type: "select",
    allLabel: t("admin:users.filters.status_label"),
    options: Object.values(ACCOUNT_STATUS).map((v) => ({
      value: v,
      label: t(`admin:users.statuses.${v}`),
    })),
  },
  {
    key: "role",
    type: "select",
    allLabel: t("admin:users.filters.role_label"),
    options: Object.values(AUTH_ROLE).map((v) => ({
      value: v,
      label: t(`admin:users.roles.${v}`),
    })),
  },
];
