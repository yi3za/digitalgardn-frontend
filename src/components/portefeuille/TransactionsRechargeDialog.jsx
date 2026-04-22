import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  ReusableDialog,
} from "../ui";
import { useRechargerPortefeuille } from "@/features/account/portefeuille/portefeuille.mutations";

/**
 * Dialog simple de recharge du portefeuille
 */
export function TransactionsRechargeDialog() {
  // Hook de traduction pour les messages du dialog, des codes API et des regles de validation
  const { t } = useTranslation(["profil", "codes", "validation"]);
  // Etat local du dialog et du champ montant
  const [open, setOpen] = useState(false);
  const [montant, setMontant] = useState("");
  const [montantError, setMontantError] = useState(null);
  // Mutation de recharge du portefeuille
  const rechargerMutation = useRechargerPortefeuille();
  // Label reutilise comme nom de champ dans les messages de validation
  const montantLabel = t("profil:portefeuille.recharge.placeholder");
  // Fonction de gestion de la recharge avec validation manuelle simple
  const handleRecharge = async () => {
    // Validation manuelle simple avant appel API
    if (!montant.trim()) {
      setMontantError(
        t("validation:validation.required", { attribute: montantLabel }),
      );
      return;
    }
    // On parse le montant en nombre pour les validations numeriques suivantes
    const montantNumber = parseFloat(montant);
    if (!Number.isFinite(montantNumber)) {
      setMontantError(
        t("validation:validation.numeric", { attribute: montantLabel }),
      );
      return;
    }
    // Le montant doit etre compris entre 1 et 100000
    if (montantNumber < 1) {
      setMontantError(
        t("validation:validation.min.numeric", {
          attribute: montantLabel,
          min: 1,
        }),
      );
      return;
    }
    if (montantNumber > 100000) {
      setMontantError(
        t("validation:validation.max.numeric", {
          attribute: montantLabel,
          max: 100000,
        }),
      );
      return;
    }
    // Appel de la mutation de recharge avec gestion des erreurs et affichage de notifications
    try {
      // Recharge du solde puis fermeture du dialog en cas de succes
      setMontantError(null);
      await rechargerMutation.mutateAsync({ montant: montantNumber });
      toast.success(t("profil:portefeuille.recharge.success"));
      setOpen(false);
    } catch (error) {
      const code = error?.response?.data?.code;
      // Le backend renvoie les erreurs de validation sous details (details === errors).
      const validationMontantError =
        code === "VALIDATION_ERROR"
          ? error?.response?.data?.details?.montant?.[0]
          : null;
      // Si on recoit une cle de validation connue, on la traduit proprement.
      if (validationMontantError) {
        setMontantError(
          t(`validation:${validationMontantError}`, {
            attribute: montantLabel,
            min: 1,
            max: 100000,
          }),
        );
      }
      toast.error(t(`codes:${code ?? "NETWORK_ERROR"}`));
    }
  };

  return (
    <ReusableDialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setMontantError("");
          setMontant("");
        }
      }}
      triggerLabel={t("profil:portefeuille.recharge.trigger")}
      triggerProps={{
        variant: "link",
      }}
      title={t("profil:portefeuille.recharge.title")}
      description={t("profil:portefeuille.recharge.description")}
      confirmLabel={t("profil:portefeuille.recharge.submit")}
      cancelLabel={t("common:actions.cancel")}
      onConfirm={handleRecharge}
      disabled={!montant || rechargerMutation.isPending}
      loading={rechargerMutation.isPending}
    >
      <FieldGroup>
        <Field data-invalid={!!montantError}>
          <FieldLabel>{montantLabel}</FieldLabel>
          <Input
            type="number"
            step="0.01"
            placeholder={montantLabel}
            value={montant}
            onChange={(e) => {
              setMontant(e.target.value);
              if (montantError) setMontantError(null);
            }}
            disabled={rechargerMutation.isPending}
            aria-invalid={!!montantError}
          />
          <FieldError>{montantError}</FieldError>
        </Field>
      </FieldGroup>
    </ReusableDialog>
  );
}
