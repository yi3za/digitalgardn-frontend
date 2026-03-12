// Selector pour acceder a l'ensemble du slice 'auth' dans le store Redux
export const authSelector = (state) => state.auth;
// Selector pour acceder a l'utilisateur connecte
export const authUserSelector = (state) => authSelector(state).user;
// Selector pour acceder au statut de l'authentification
export const authStatusSelector = (state) => authSelector(state).status;
// Selector pour savoir si une requete d'authentification est en cours
export const authLoadingSelector = (state) => authSelector(state).loading;
// Selector pour acceder aux erreurs d'authentification
export const authErrorSelector = (state) => authSelector(state).error;
