import {
  FieldError,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui";
import { storeMessageSchema } from "@/features/messages/messages.schemas";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

/**
 * Composant affichant le formulaire d'envoi de message dans une conversation
 */
export function MessageInput({ onSend, isSending, disabled }) {
  // Traduction
  const { t } = useTranslation(["messages", "codes"]);
  // Etat local pour le contenu du message et les erreurs de validation
  const [content, setContent] = useState("");
  // Etat local pour le message d'erreur de validation du contenu du message
  const [error, setError] = useState("");
  // Fonction de validation du contenu du message et d'appel de la fonction d'envoi passee en props, avec gestion des erreurs potentielles
  const submit = async () => {
    const validation = storeMessageSchema.safeParse({ content });
    if (!validation.success) {
      setError(t("input.invalid", { max: 5000 }));
      return;
    }
    // Appeler la fonction d'envoi de message passee en props et gerer les erreurs potentielles
    try {
      await onSend(validation.data.content);
      setContent("");
      setError("");
    } catch (error) {
      const { code } = error?.response?.data ?? {};
      toast.error(t(`codes:${code}`));
      setError(t(`codes:${code}`));
    }
  };
  // Fonction de gestion de l'appui sur la touche "Entrée" pour envoyer le message, en evitant d'envoyer le message si Shift+Entrée est presse pour faire un saut de ligne
  const handleKeyDown = async (event) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    await submit();
  };

  return (
    <div className="w-full space-y-2">
      <InputGroup>
        <InputGroupInput
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            if (error) setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder={t("input.placeholder")}
          disabled={disabled || isSending}
          aria-invalid={!!error}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-sm"
            onClick={submit}
            disabled={disabled || isSending || !content.trim()}
            aria-label={t("input.send")}
          >
            <SendHorizonal className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldError>{error}</FieldError>
    </div>
  );
}
