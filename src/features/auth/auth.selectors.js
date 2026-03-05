// Selector pour acceder a l'ensemble du slice 'auth' dans le store Redux
export const authSelector = (state) => state.auth;
// Selector pour acceder au statut de l'authentification
export const authStatusSelector = (state) => authSelector(state).status;
// Selector pour acceder a la valeur 'checked' de l'auth
export const authCheckedSelector = (state) => authSelector(state).checked;
// Selector pour acceder aux erreurs d'authentification
export const authErrorSelector = (state) => authSelector(state).error;
