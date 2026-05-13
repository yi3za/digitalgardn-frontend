import { Item, ItemContent, ItemGroup, ItemHeader, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

function ServiceSkeleton() {
  return (
    <Item className="p-0 overflow-hidden">
      <ItemHeader className="relative min-h-60 max-h-60 rounded overflow-hidden">
        <Skeleton className="min-h-60 rounded-none" />
      </ItemHeader>
      <ItemContent className="gap-2 p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-5 w-24" />
      </ItemContent>
    </Item>
  );
}

function ServicesSkeleton({ count = 6, className }) {
  return (
    <ItemGroup
      className={cn(
        "grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ServiceSkeleton key={index} />
      ))}
    </ItemGroup>
  );
}

export { ServiceSkeleton, ServicesSkeleton };
