import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Textarea,
  ReusableDialog,
} from "../ui";
import { StarRating } from "../ui/star-rating";
import { useCreateAvis } from "@/features/account/commandes/commandes.mutations";
import { storeAvisSchema } from "@/features/account/commandes/commandes.avis.schemas";

/**
 * Dialog pour laisser un avis sur une commande terminee
 */
export function AvisDialog({ commande }) {
  // Traduction
  const { t } = useTranslation(["commandes", "codes", "validation"]);
  // Etat local du dialog et des champs
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [noteError, setNoteError] = useState("");
  const [commentaireError, setCommentaireError] = useState("");
  // Mutation pour creer un avis
  const storeAvisMutation = useCreateAvis();
  // Labels reutilises
  const noteLabel = t("commandes:avis.note");
  const commentaireLabel = t("commandes:avis.commentaire");
  // Fonction de validation et de soumission
  const handleSubmit = async () => {
    // Reinitialiser les erreurs
    setNoteError("");
    setCommentaireError("");
    // Validation avec Zod
    const noteNum = note ? parseInt(note, 10) : undefined;
    const validation = storeAvisSchema.safeParse({
      note: noteNum,
      commentaire: commentaire.trim() || undefined,
    });
    if (!validation.success) {
      // Extraire les erreurs par champ
      const errors = validation.error.flatten().fieldErrors;
      if (errors.note?.[0]) {
        setNoteError(
          t(`validation:${errors.note[0]}`, { attribute: noteLabel }),
        );
      }
      if (errors.commentaire?.[0]) {
        setCommentaireError(
          t(`validation:${errors.commentaire[0]}`, {
            attribute: commentaireLabel,
            min: 20,
            max: 500,
          }),
        );
      }
      return;
    }
    // Appel de la mutation avec gestion d'erreur
    try {
      await storeAvisMutation.mutateAsync({
        commandeId: commande.id,
        data: validation.data,
      });
      toast.success(t("commandes:avis.success"));
      // Reinitialiser et fermer le dialog
      setOpen(false);
      setNote("");
      setCommentaire("");
    } catch (error) {
      const code = error?.response?.data?.code ?? "NETWORK_ERROR";
      const validationErrors = error?.response?.data?.details ?? {};
      // Afficher les erreurs de validation du backend si presentes
      if (validationErrors.note?.[0]) {
        setNoteError(
          t(`validation:${validationErrors.note[0]}`, { attribute: noteLabel }),
        );
      }
      if (validationErrors.commentaire?.[0]) {
        setCommentaireError(
          t(`validation:${validationErrors.commentaire[0]}`, {
            attribute: commentaireLabel,
          }),
        );
      }
      toast.error(t(`codes:${code}`));
    }
  };
  return (
    <ReusableDialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          // Reinitialiser a la fermeture
          setNote("");
          setCommentaire("");
          setNoteError("");
          setCommentaireError("");
        }
      }}
      triggerLabel={t("commandes:avis.trigger")}
      triggerProps={{
        variant: "default",
        className: "w-full",
      }}
      title={t("commandes:avis.title")}
      description={t("commandes:avis.description")}
      confirmLabel={t("commandes:avis.submit")}
      cancelLabel={t("common:actions.cancel")}
      onConfirm={handleSubmit}
      disabled={!note || storeAvisMutation.isPending}
      loading={storeAvisMutation.isPending}
    >
      <FieldGroup>
        <Field data-invalid={!!noteError}>
          <FieldLabel>{noteLabel}</FieldLabel>
          <div className="flex items-center gap-3">
            <StarRating
              value={note ? parseInt(note, 10) : 0}
              onChange={(val) => {
                setNote(String(val));
                if (noteError) setNoteError("");
              }}
              disabled={storeAvisMutation.isPending}
              count={5}
            />
            {note && (
              <span className="text-sm font-medium text-gray-600">
                {note}/5
              </span>
            )}
          </div>
          <FieldError>{noteError}</FieldError>
        </Field>
        <Field data-invalid={!!commentaireError}>
          <FieldLabel>
            {commentaireLabel} ({t("commandes:avis.optional")})
          </FieldLabel>
          <Textarea
            className="overflow-y-auto max-h-100"
            value={commentaire}
            onChange={(e) => {
              setCommentaire(e.target.value);
              if (commentaireError) setCommentaireError("");
            }}
            placeholder={t("commandes:avis.commentairePlaceholder")}
            disabled={storeAvisMutation.isPending}
            minLength={commentaire.trim() ? 20 : 0}
          />
          <FieldError>{commentaireError}</FieldError>
        </Field>
      </FieldGroup>
    </ReusableDialog>
  );
}
