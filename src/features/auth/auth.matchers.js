import {
  getActionName,
  isFulfilled,
  isPending,
  isRejected,
} from "./auth.utils";

/**
 * Ajoute des matchers a un builder de createSlice pour gerer :
 * - les etats de chargement
 * - les erreurs de toutes les actions d'un slice
 */
export const withLoadingAndError = (builder, prefix = "auth") =>
  builder
    .addMatcher(
      (action) => isPending(action.type, prefix),
      (state, action) => {
        const actionName = getActionName(action.type);
        state.loading[actionName] = true;
        state.error[actionName] = null;
      },
    )
    .addMatcher(
      (action) => isFulfilled(action.type, prefix),
      (state, action) => {
        const actionName = getActionName(action.type);
        state.loading[actionName] = false;
      },
    )
    .addMatcher(
      (action) => isRejected(action.type, prefix),
      (state, action) => {
        const actionName = getActionName(action.type);
        state.error[actionName] = action.payload;
        state.loading[actionName] = false;
      },
    );
