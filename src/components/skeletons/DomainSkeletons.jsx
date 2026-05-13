import {
  Card,
  CardContent,
  CardHeader,
  Item,
  ItemContent,
  ItemGroup,
  Skeleton,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { ServicesSkeleton } from "./ServicesSkeleton";
import { AvisListSkeleton, ListSkeleton } from "./ListSkeleton";

function PortefeuilleSkeleton({ className }) {
  return (
    <ItemGroup className={cn("grid grid-cols-1 md:grid-cols-3 gap-3", className)}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Item key={index} variant="muted">
          <ItemContent>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-24" />
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}

function ServiceDetailsSkeleton({ className }) {
  return (
    <div className={cn("space-y-4", className)}>
      <Card className="shadow-none overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
          <div className="px-6 py-6 flex items-center">
            <Skeleton className="min-h-80 rounded-lg" />
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Item key={index} variant="outline" className="py-3">
                  <ItemContent>
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </ItemContent>
                </Item>
              ))}
            </div>
            <ListSkeleton count={2} avatar={false} actions={false} />
            <Skeleton className="h-10 w-36" />
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

function FreelancerProfileSkeleton() {
  return (
    <div className="py-5 space-y-4">
      <Card className="shadow-none">
        <CardHeader>
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-28" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="size-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <ListSkeleton count={2} avatar={false} actions={false} />
        </CardContent>
      </Card>
      <ServicesSkeleton count={3} />
      <AvisListSkeleton />
    </div>
  );
}

function CommandesSkeleton({ count = 4, className }) {
  return <ListSkeleton count={count} className={className} avatar={false} />;
}

function MultiSelectSkeleton({ className }) {
  return (
    <div className={cn("w-full rounded-md border p-2", className)}>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export {
  PortefeuilleSkeleton,
  ServiceDetailsSkeleton,
  FreelancerProfileSkeleton,
  CommandesSkeleton,
  MultiSelectSkeleton,
};
