import {
  Avatar,
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  Skeleton,
} from "@/components/ui";
import { cn } from "@/lib/utils";

function FreelancerSkeleton() {
  return (
    <Item variant="outline" className="gap-3">
      <Avatar className="size-12">
        <Skeleton className="size-full rounded-full" />
      </Avatar>
      <ItemContent>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-20" />
        <ItemActions className="mt-1 flex-wrap gap-2">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </ItemActions>
      </ItemContent>
      <ItemActions className="self-start">
        <Skeleton className="h-8 w-14" />
      </ItemActions>
    </Item>
  );
}

function FreelancersSkeleton({ count = 3, className }) {
  return (
    <ItemGroup className={cn("grid gap-4 sm:grid-cols-1 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <FreelancerSkeleton key={index} />
      ))}
    </ItemGroup>
  );
}

export { FreelancerSkeleton, FreelancersSkeleton };
