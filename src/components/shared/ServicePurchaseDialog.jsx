import { useState, useEffect } from "react";
import {
  ReusableDialog,
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
  Textarea,
} from "@/components/ui";

/**
 * Dialog de saisie des instructions pour l'achat d'un service
 */
export function ServiceInstructionsDialog({
  t,
  open,
  onOpenChange,
  onConfirm,
  triggerLabel,
  triggerProps = {},
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmVariant = "default",
  disabled: disabledProp,
  loading,
  initialValue = "",
}) {
  // Etat local pour gerer les instructions saisies et les erreurs de validation
  const [instructions, setInstructions] = useState(initialValue || "");
  const [error, setError] = useState("");
  // Reset field when dialog opens/closes or initialValue changes
  useEffect(() => {
    if (!open) {
      setInstructions(initialValue || "");
      setError("");
    }
  }, [open, initialValue]);
  // Determination des textes a afficher en utilisant les props ou les valeurs par defaut avec traduction
  const realTitle = title || t("catalog:serviceShow.dialog.instructionsTitle");
  const realDescription =
    description || t("catalog:serviceShow.dialog.instructionsDescription");
  const realConfirmLabel = confirmLabel || t("common:actions.confirm");
  const realCancelLabel = cancelLabel || t("common:actions.cancel");
  // Le champ est desactive si une erreur de validation est presente, si le prop disabled est a true, ou si le loading est en cours
  const disabled = !!error || disabledProp || loading;
  // Longueur maximale des instructions pour la validation
  const maxInstructionsLength = 5000;
  // Fonction de gestion de la confirmation du dialog avec validation simple des instructions
  const handleConfirm = () => {
    if (instructions && instructions.length > maxInstructionsLength) {
      setError(
        t("validation:validation.max.string", {
          attribute: t("catalog:serviceShow.dialog.instructionsLabel"),
          max: maxInstructionsLength,
        }),
      );
      return;
    }
    setError("");
    if (onConfirm) onConfirm(instructions.trim() ? instructions : null);
  };

  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      triggerLabel={triggerLabel}
      triggerProps={triggerProps}
      title={realTitle}
      description={realDescription}
      confirmLabel={realConfirmLabel}
      cancelLabel={realCancelLabel}
      confirmVariant={confirmVariant}
      onConfirm={handleConfirm}
      disabled={disabled}
      loading={loading}
    >
      <FieldGroup>
        <Field data-invalid={!!error}>
          <FieldLabel>
            {t("catalog:serviceShow.dialog.instructionsLabel")}
          </FieldLabel>
          <Textarea
            className="overflow-y-auto max-h-100"
            placeholder={t(
              "catalog:serviceShow.dialog.instructionsPlaceholder",
            )}
            value={instructions}
            onChange={(e) => {
              setInstructions(e.target.value);
              if (error) setError("");
            }}
            maxLength={maxInstructionsLength}
            aria-invalid={!!error}
          />
          <div className="text-xs text-muted-foreground">
            {instructions.length}/{maxInstructionsLength}
          </div>
          <FieldError>{error}</FieldError>
        </Field>
      </FieldGroup>
    </ReusableDialog>
  );
}
