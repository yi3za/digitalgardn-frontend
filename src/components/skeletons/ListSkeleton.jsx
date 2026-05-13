import { Avatar, Item, ItemActions, ItemContent, ItemGroup, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

function ListItemSkeleton({ avatar = true, actions = true }) {
  return (
    <Item variant="outline" className="gap-3">
      {avatar && (
        <Avatar className="size-10">
          <Skeleton className="size-full rounded-full" />
        </Avatar>
      )}
      <ItemContent>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-64 max-w-full" />
      </ItemContent>
      {actions && (
        <ItemActions>
          <Skeleton className="h-8 w-20" />
        </ItemActions>
      )}
    </Item>
  );
}

function ListSkeleton({ count = 5, className, avatar = true, actions = true }) {
  return (
    <ItemGroup className={cn("gap-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <ListItemSkeleton key={index} avatar={avatar} actions={actions} />
      ))}
    </ItemGroup>
  );
}

function RecentListSkeleton(props) {
  return <ListSkeleton count={4} {...props} />;
}

function ServiceMiniSkeleton() {
  return (
    <Item size="sm" className="p-0 flex-nowrap">
      <Skeleton className="size-10 shrink-0 rounded-sm" />
      <ItemContent>
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-48 max-w-full" />
      </ItemContent>
    </Item>
  );
}

function ServicesMiniListSkeleton({ count = 4, className }) {
  return (
    <ItemGroup className={cn("gap-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <ServiceMiniSkeleton key={index} />
      ))}
    </ItemGroup>
  );
}

function AvisListSkeleton({ count = 3, className }) {
  return (
    <ItemGroup className={cn("gap-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Item key={index} variant="outline">
          <ItemContent>
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </ItemContent>
          <ItemActions>
            <Skeleton className="h-4 w-24" />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}

export {
  ListItemSkeleton,
  ListSkeleton,
  RecentListSkeleton,
  ServiceMiniSkeleton,
  ServicesMiniListSkeleton,
  AvisListSkeleton,
};
