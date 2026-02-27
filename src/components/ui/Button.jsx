// Composant bouton reutilisable
export default function Button({ text, children, ...props }) {
  // Si 'text' est fourni, l'affiche, sinon affiche 'children'
  return <button {...props}>{text ?? children}</button>;
}
