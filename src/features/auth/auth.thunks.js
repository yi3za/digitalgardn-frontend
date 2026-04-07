import { createApiThunk } from "@/lib/utils";
import {
  login,
  register,
  getMe,
  logout,
  uploadAvatar,
  updateInfo,
  changePassword,
  completeOnboarding,
  switchToFreelance,
  updateFreelanceProfil,
  activateAccount,
  deactivateAccount,
  deleteAccount,
} from "./auth.api";

// thunk pour la connexion de l'utilisateur
export const loginThunk = createApiThunk("auth/login", login);
// thunk pour l'inscription de l'utilisateur
export const registerThunk = createApiThunk("auth/register", register);
// thunk pour la recuperation de l'utilisateur authentifie
export const getMeThunk = createApiThunk("auth/getMe", getMe);
// thunk pour la deconnexion de l'utilisateur
export const logoutThunk = createApiThunk("auth/logout", logout);
// thunk pour l'upload de l'avatar de l'utilisateur
export const uploadAvatarThunk = createApiThunk(
  "auth/uploadAvatar",
  uploadAvatar,
);
// thunk pour la mise a jour des informations de l'utilisateur
export const updateInfoThunk = createApiThunk("auth/updateInfo", updateInfo);
// thunk pour le changement de mot de passe de l'utilisateur
export const changePasswordThunk = createApiThunk(
  "auth/changePassword",
  changePassword,
);
// thunk pour la reinitialisation du mot de passe de l'utilisateur
export const resetPasswordThunk = createApiThunk(
  "auth/resetPassword",
  resetPassword,
);
// thunk pour l'envoi du code de reinitialisation du mot de passe
export const sendResetCodeThunk = createApiThunk(
  "auth/sendResetCode",
  sendResetCode,
);
// thunk pour le completion de l'onboarding de l'utilisateur
export const completeOnboardingThunk = createApiThunk(
  "auth/completeOnboarding",
  completeOnboarding,
);
// thunk pour le changement de role de l'utilisateur vers freelance
export const switchToFreelanceThunk = createApiThunk(
  "auth/switchToFreelance",
  switchToFreelance,
);
// thunk pour la mise a jour du profil freelance de l'utilisateur
export const updateFreelanceProfilThunk = createApiThunk(
  "auth/updateFreelanceProfil",
  updateFreelanceProfil,
);
// thunk pour l'activation du compte utilisateur
export const activateAccountThunk = createApiThunk(
  "auth/activateAccount",
  activateAccount,
);
// thunk pour la desactivation du compte utilisateur
export const deactivateAccountThunk = createApiThunk(
  "auth/deactivateAccount",
  deactivateAccount,
);
// thunk pour la suppression du compte utilisateur
export const deleteAccountThunk = createApiThunk(
  "auth/deleteAccount",
  deleteAccount,
);
