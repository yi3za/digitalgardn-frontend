import { Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

function ChartSkeleton({ bars = 7, className }) {
  return (
    <div className={cn("flex h-72 w-full items-end gap-3 p-4", className)}>
      {Array.from({ length: bars }).map((_, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-3">
          <Skeleton
            className="w-full rounded-t-md"
            style={{ height: `${35 + ((index * 17) % 55)}%` }}
          />
          <Skeleton className="h-3 w-10" />
        </div>
      ))}
    </div>
  );
}

function StatsSkeleton({ count = 4, className }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-md border p-4 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

function StatValueSkeleton({ className }) {
  return <Skeleton className={cn("h-8 w-full", className)} />;
}

export { ChartSkeleton, StatsSkeleton, StatValueSkeleton };
