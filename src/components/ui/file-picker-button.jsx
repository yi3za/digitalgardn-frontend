import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

/**
 * Composant bouton qui ouvre un selecteur de fichier natif
 * Reutilisable partout dans le projet (messages, upload livraison, etc.)
 */
export function FilePickerButton({
  // Callback appele avec le File selectionne
  onFilePick,
  // Types de fichiers acceptes (ex: ".pdf,.zip,image/*")
  accept,
  // Classe CSS additionnelle pour le bouton visible
  className,
  // Contenu du bouton (icone, texte)
  children,
  // Desactiver le bouton
  disabled,
  // Props supplementaires passes au Button
  ...props
}) {
  // Ref vers l'input file cache pour le declenchement programmatique
  const inputRef = useRef(null);
  // Ouvre le selecteur de fichier natif au clic
  const handleClick = () => {
    inputRef.current?.click();
  };
  // Appelle le callback avec le fichier selectionne puis remet l'input a zero
  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (file) onFilePick(file);
    // Reinitialiser pour permettre de selectionner le meme fichier a nouveau
    event.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />
      <Button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={cn(className)}
        {...props}
      >
        {children}
      </Button>
    </>
  );
}
