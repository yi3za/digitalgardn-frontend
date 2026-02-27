import { useFormContext } from "react-hook-form";

// Composant FormInput reutilisable pour un champ de formulaire
export default function FormInput({ label, children, name, ...props }) {
  // Recupere la fonction register et les erreurs depuis le contexte du formulaire
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div>
      {/* Label du champ : utilise 'label' si fourni, sinon le contenu 'children' */}
      <label htmlFor={name}>{label ?? children}</label>
      {/* Input standard enregistre aupres de React Hook Form */}
      <input id={name} name={name} {...register(name)} {...props} />
      {/* Affiche un message d'erreur sous le champ si une erreur existe */}
      {errors?.[name] && <span>{errors?.[name]?.message}</span>}
    </div>
  );
}
