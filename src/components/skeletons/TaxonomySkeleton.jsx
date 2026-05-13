import {
  Item,
  ItemContent,
  ItemMedia,
  ScrollArea,
  ScrollBar,
  Skeleton,
} from "@/components/ui";
import { cn } from "@/lib/utils";

function TaxonomySkeletonItem() {
  return (
    <Item className="p-2 min-w-50 overflow-hidden" variant="outline">
      <ItemMedia className="w-12 h-12">
        <Skeleton className="h-full w-full rounded" />
      </ItemMedia>
      <ItemContent>
        <Skeleton className="h-4 w-28" />
      </ItemContent>
    </Item>
  );
}

function TaxonomySkeleton({ count = 6, variant = "scroll", className }) {
  const content = Array.from({ length: count }).map((_, index) => (
    <TaxonomySkeletonItem key={index} />
  ));

  if (variant === "grid") {
    return (
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
          className,
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <ScrollArea className={className}>
      <div className="flex gap-4 mb-8">{content}</div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export { TaxonomySkeleton, TaxonomySkeletonItem };
