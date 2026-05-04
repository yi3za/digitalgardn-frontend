import {
  FieldError,
  FilePickerButton,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui";
import { storeMessageSchema } from "@/features/messages/messages.schemas";
import { Paperclip, SendHorizonal, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// Taille maximale autorisee pour un fichier joint (50 Mo en octets)
const FICHIER_MAX_SIZE = 50 * 1024 * 1024;
// Extensions autorisees, identiques aux mimes du backend
const FICHIER_ACCEPT =
  ".doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z,.tar,.gz,.png,.jpg,.jpeg,.gif,.webp,.mp4,.mov,.mp3,.wav";

/**
 * Composant affichant le formulaire d'envoi de message dans une conversation
 */
export function MessageInput({ onSend, onSendFile, isSending, disabled }) {
  // Traduction
  const { t } = useTranslation(["messages", "codes", "validation"]);
  // Etat local pour le contenu du message et les erreurs de validation
  const [content, setContent] = useState("");
  // Etat local pour le message d'erreur de validation du contenu du message
  const [error, setError] = useState("");
  // Etat local pour le fichier selectionne avant envoi
  const [fichier, setFichier] = useState(null);

  // Validation et selection du fichier : verifie la taille et l'extension avant d'accepter
  const handleFilePick = (file) => {
    // Verifier la taille maximale (max.file attend des Ko)
    if (file.size > FICHIER_MAX_SIZE) {
      setError(
        t("validation:validation.max.file", {
          attribute: t("input.attachFile"),
          max: 51200,
        }),
      );
      return;
    }
    // Verifier l'extension contre la liste autorisee
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!FICHIER_ACCEPT.includes(ext)) {
      setError(
        t("validation:validation.mimes", {
          attribute: t("input.attachFile"),
          values: FICHIER_ACCEPT.split(",")
            .map((e) => e.replace(".", ""))
            .join(", "),
        }),
      );
      return;
    }
    setError("");
    setFichier(file);
  };
  // Fonction de validation du contenu du message et d'appel de la fonction d'envoi passee en props, avec gestion des erreurs potentielles
  const submit = async () => {
    // Si un fichier est selectionne, l'envoyer via onSendFile
    if (fichier) {
      try {
        await onSendFile(fichier, content);
        setFichier(null);
        setContent("");
        setError("");
      } catch (err) {
        const { code } = err?.response?.data ?? {};
        setError(t(`codes:${code}`));
        toast.error(t(`codes:${code ?? "NETWORK_ERROR"}`));
      }
      return;
    }
    // Sinon valider et envoyer le message texte
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

  // Determine si la conversation est fermee (termine ou annulee)
  const isConversationClosed = disabled && !isSending;
  // Determine si le bouton d'envoi doit etre desactive
  const isSendDisabled = disabled || isSending || (!content.trim() && !fichier);

  return (
    <div className="w-full space-y-2">
      {isConversationClosed ? (
        <div className="w-full text-center text-sm text-muted-foreground">
          {t("input.conversationClosed")}
        </div>
      ) : (
        <div className="w-full space-y-2">
          {fichier && (
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>{fichier.name}</ItemTitle>
                <ItemDescription>
                  {t("input.fileSize", {
                    size: (fichier.size / (1024 * 1024)).toFixed(2),
                  })}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <InputGroupButton
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setFichier(null)}
                >
                  <X className="size-4" />
                </InputGroupButton>
              </ItemActions>
            </Item>
          )}
          <InputGroup className="py-6">
            <InputGroupInput
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                if (error) setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                fichier
                  ? t("input.placeholderWithFile")
                  : t("input.placeholder")
              }
              disabled={disabled || isSending}
              aria-invalid={!!error}
            />
            <InputGroupAddon align="inline-end">
              {onSendFile && (
                <FilePickerButton
                  onFilePick={handleFilePick}
                  accept={FICHIER_ACCEPT}
                  variant="ghost"
                  size="icon-sm"
                  disabled={disabled || isSending}
                  aria-label={t("input.attachFile")}
                  className="size-8 p-0"
                >
                  <Paperclip className="size-4" />
                </FilePickerButton>
              )}
              <InputGroupButton
                size="icon-sm"
                onClick={submit}
                disabled={isSendDisabled}
              >
                <SendHorizonal className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldError>{error}</FieldError>
        </div>
      )}
    </div>
  );
}
