import { formatDateTime, formatPrice } from "@/lib/utils";
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
  recharge: { icon: ArrowDownLeft, className: "text-green-500" },
  gain: { icon: ArrowDownLeft, className: "text-green-500" },
  achat: { icon: ArrowUpRight, className: "text-red-500" },
  remboursement: { icon: RefreshCw, className: "text-blue-500" },
};

/**
 * Ligne d'affichage d'une transaction
 */
export function TransactionRow({ tx, t }) {
  const meta = TRANSACTION_META[tx.type];
  const Icon = meta.icon;
  // Prefixe signe selon le sens de la transaction
  const sign = tx.type === "achat" ? "-" : "+";

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
