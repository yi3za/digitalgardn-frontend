import { RefreshCw } from "lucide-react";
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Spinner,
} from "@/components/ui";

/**
 * En-tete standard pour les pages admin avec titre, description et bouton refresh
 */
export function AdminPageHeader({
  title,
  description,
  onRefresh,
  isFetching = false,
  actions = null,
}) {
  return (
    <CardHeader>
      <CardTitle>
        {title} {isFetching && <Spinner className="inline ml-2" />}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
      <CardAction>
        <Button size="sm" variant="ghost" onClick={onRefresh}>
          <RefreshCw className="size-4" />
        </Button>
        {actions}
      </CardAction>
    </CardHeader>
  );
}
