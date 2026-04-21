import { AlertCircle, Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "./empty";
import { Skeleton } from "./skeleton";

function DataLoading({ className }) {
  return (
    <Empty className={cn("relative min-h-50 border md:p-0", className)}>
      <Skeleton className="absolute inset-0" />
    </Empty>
  );
}

function DataError({ errorCode = null, className, retryText, onRetry }) {
  const { t } = useTranslation("codes");

  return (
    <Empty className={cn("border border-destructive", className)}>
      <EmptyHeader>
        <EmptyMedia>
          <AlertCircle className="size-6 text-destructive" />
        </EmptyMedia>
        <EmptyDescription className="text-destructive">
          {t(errorCode ?? "NETWORK_ERROR")}
        </EmptyDescription>
      </EmptyHeader>
      {onRetry && retryText ? (
        <EmptyContent>
          <Button variant="link" className="text-destructive" onClick={onRetry}>
            {retryText}
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}

function DataEmpty({ description = null, className }) {
  return (
    <Empty className={cn("border", className)}>
      <EmptyHeader>
        <EmptyMedia>
          <Inbox className="size-6 text-muted-foreground" />
        </EmptyMedia>
        {description ? (
          <EmptyDescription>{description}</EmptyDescription>
        ) : null}
      </EmptyHeader>
    </Empty>
  );
}

export { DataLoading, DataError, DataEmpty };
