import { loginThunk } from "../../features/auth/auth.thunks";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/ui/Button";
import FormWrapper from "../../components/ui/FormWrapper";
import FormInput from "../../components/ui/FormInput";
import { errorSelector } from "../../features/auth/auth.selectors";
import { useTranslation } from "react-i18next";

// Page de connexion
export default function Login() {
  // Utilise Redux pour dispatcher l'action loginThunk
  const dispatch = useDispatch();
  // Fonction pour traduire les textes selon la langue selectionnee
  const { t } = useTranslation();
  // Recupere les erreurs du slice auth depuis le store
  const error = useSelector(errorSelector);
  // Fonction appelee a la soumission du formulaire
  const submit = (data) => dispatch(loginThunk(data));
  // FormWrapper fournit le contexte react-hook-form et gere les erreurs serveur
  return (
    <FormWrapper onSubmit={submit} serverError={error}>
      {/* Champ email connecte au formulaire */}
      <FormInput label={t("email")} name="email" />
      {/* Champ password connecte au formulaire */}
      <FormInput label={t("password")} name="password" />
      {/* Bouton de soumission du formulaire */}
      <Button text={t("login")} />
    </FormWrapper>
  );
}
