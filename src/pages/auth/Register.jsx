import { registerThunk } from "../../features/auth/auth.thunks";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/ui/Button";
import FormWrapper from "../../components/ui/FormWrapper";
import FormInput from "../../components/ui/FormInput";
import { errorSelector } from "../../features/auth/auth.selectors";
import { useTranslation } from "react-i18next";
import FormRadio from "../../components/ui/FormRadio";

// Page de l'inscription
export default function Register() {
  // Utilise Redux pour dispatcher l'action registerThunk
  const dispatch = useDispatch();
  // Fonction pour traduire les textes selon la langue selectionnee
  const { t } = useTranslation();
  // Recupere les erreurs du slice auth depuis le store
  const error = useSelector(errorSelector);
  // Fonction appelee a la soumission du formulaire
  const submit = (data) => {
    console.log(data);
    dispatch(registerThunk(data));
  };
  // FormWrapper fournit le contexte react-hook-form et gere les erreurs serveur
  return (
    <FormWrapper onSubmit={submit} serverError={error}>
      {/* Champ pour le nom complet de l'utilisateur */}
      <FormInput label={t("name")} name="name" />
      {/* Champ pour le nom d'utilisateur */}
      <FormInput label={t("username")} name="username" />
      {/* Champ email connecte au formulaire */}
      <FormInput type="email" label={t("email")} name="email" />
      {/* Champ password connecte au formulaire */}
      <FormInput type="password" label={t("password")} name="password" />
      {/* Champ de confirmation du password */}
      <FormInput
        type="password"
        label={t("password_confirmation")}
        name="password_confirmation"
      />
      {/* Selection du role de l'utilisateur (client ou freelance) */}
      <FormRadio
        label={t("role")}
        name="role"
        choices={["client", "freelance"].map((c) => t(c))}
      />
      {/* Bouton de soumission du formulaire */}
      <Button text={t("register")} />
    </FormWrapper>
  );
}
