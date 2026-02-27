// Composant pour afficher un message d'erreur
export default function ErrorMessage({ message, ...props }) {
  // Retourne null si aucun message n'est fourni
  if (!message) return null;
  // Affiche le message d'erreur avec tous les props passes
  return <div {...props}>{message}</div>;
}
