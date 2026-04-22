import { formatDateTime, formatPrice } from "@/lib/utils";
import { TRANSACTION_TYPE } from "@/features/account/portefeuille/portefeuille.constants";
import {
  Badge,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui";
import { ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react";

// Metadonnees par type de transaction : icone et couleur
const TRANSACTION_META = {
  [TRANSACTION_TYPE.RECHARGE]: {
    icon: ArrowDownLeft,
    className: "text-green-500",
  },
  [TRANSACTION_TYPE.GAIN]: { icon: ArrowDownLeft, className: "text-green-500" },
  [TRANSACTION_TYPE.ACHAT]: { icon: ArrowUpRight, className: "text-red-500" },
  [TRANSACTION_TYPE.REMBOURSEMENT]: {
    icon: RefreshCw,
    className: "text-blue-500",
  },
};

/**
 * Ligne d'affichage d'une transaction
 */
export function TransactionRow({ tx, t }) {
  const meta = TRANSACTION_META[tx.type];
  const Icon = meta.icon;
  // Prefixe signe selon le sens de la transaction
  const sign = tx.type === TRANSACTION_TYPE.ACHAT ? "-" : "+";

  return (
    <Item size="sm">
      <ItemMedia>
        <Icon className={meta.className} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {t(`profil:portefeuille.transactions.types.${tx.type}`)}
        </ItemTitle>
        <ItemDescription>{formatDateTime(tx.created_at)}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge variant="outline" className={meta.className}>
          {sign}
          {formatPrice(tx.montant)}
        </Badge>
      </ItemActions>
    </Item>
  );
}
