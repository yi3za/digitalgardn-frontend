import { formatDateTime, formatPrice } from "@/lib/utils";
import {
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_BADGE_VARIANT,
} from "@/features/account/portefeuille/portefeuille.constants";
import {
  Badge,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "../ui";

/**
 * Ligne d'affichage d'une transaction
 */
export function TransactionRow({ transaction, t }) {
  // Prefixe signe selon le sens de la transaction
  const sign = transaction.type === TRANSACTION_TYPE.ACHAT ? "-" : "+";

  return (
    <Item size="sm">
      <ItemContent>
        <ItemTitle>
          {t(`profil:portefeuille.transactions.types.${transaction.type}`)}
        </ItemTitle>
        <ItemDescription>
          {formatDateTime(transaction.created_at)}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge variant={TRANSACTION_TYPE_BADGE_VARIANT[transaction.type]}>
          {sign}
          {formatPrice(transaction.montant)}
        </Badge>
      </ItemActions>
    </Item>
  );
}
