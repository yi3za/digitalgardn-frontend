// Selector pour acceder à l'ensemble du slice 'auth' dans le store Redux
export const authSelector = (state) => state.auth;
// Selector pour acceder au statut de l'authentification
export const statusSelector = (state) => state.auth.status;
// Selector pour acceder à la valeur 'checked' de l'auth
export const checkedSelector = (state) => state.auth.checked;
// Selector pour acceder aux erreurs d'authentification
export const errorSelector = (state) => state.auth.error;
