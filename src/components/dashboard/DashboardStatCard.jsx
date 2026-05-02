import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Carte de statistique individuelle pour le dashboard
 */
export function DashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
  isLoading,
  className,
}) {
  return (
    <Card className={cn("gap-3", className, "shadow-none")}>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-xl font-bold ">
          {isLoading ? <Skeleton className="h-8 w-full" /> : (value ?? "—")}
        </CardTitle>
        {Icon && (
          <CardAction>
            <Icon size={20} className="text-muted-foreground" />
          </CardAction>
        )}
      </CardHeader>
      {description && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      )}
    </Card>
  );
}
