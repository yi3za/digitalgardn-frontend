import { useFormContext } from "react-hook-form";

// Composant pour generer un groupe de boutons radio
export default function FormRadio({ name, label, choices, ...props }) {
  // Recupere register et les erreurs depuis le contexte du formulaire
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div>
      {/* Label principal du champ radio */}
      <label>{label}</label>
      {/* Generation dynamique des boutons radio */}
      {choices.map((choice) => (
        <label key={choice}>
          <input type="radio" {...register(name)} value={choice} {...props} />
          {choice} {/* Affiche le texte du choix */}
        </label>
      ))}
      {/* Affiche le message d'erreur si une erreur existe pour ce champ */}
      {errors?.[name] && <span>{errors?.[name]?.message}</span>}
    </div>
  );
}
