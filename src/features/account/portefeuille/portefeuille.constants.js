/**
 * Types possibles d'une transaction de portefeuille
 */
export const TRANSACTION_TYPE = {
  RECHARGE: "recharge",
  GAIN: "gain",
  ACHAT: "achat",
  REMBOURSEMENT: "remboursement",
};

/**
 * Variante de badge selon le type de transaction
 */
export const TRANSACTION_TYPE_BADGE_VARIANT = {
  [TRANSACTION_TYPE.RECHARGE]: "secondary",
  [TRANSACTION_TYPE.GAIN]: "default",
  [TRANSACTION_TYPE.ACHAT]: "destructive",
  [TRANSACTION_TYPE.REMBOURSEMENT]: "outline",
};
