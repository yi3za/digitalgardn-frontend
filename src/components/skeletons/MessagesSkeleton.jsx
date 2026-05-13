import { Card, CardContent, CardFooter, CardHeader, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

function ConversationListSkeleton({ count = 6, className }) {
  return (
    <div className={cn("space-y-2 px-2", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-md border p-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-44 max-w-full" />
          </div>
          <Skeleton className="size-3 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function ChatMessagesSkeleton({ count = 6, className }) {
  return (
    <div className={cn("w-full space-y-3 px-5 py-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn("flex", index % 2 === 0 ? "justify-start" : "justify-end")}
        >
          <div className="w-2/3 max-w-md space-y-2 rounded-md border p-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatWindowSkeleton() {
  return (
    <Card className="h-[80vh] lg:h-full flex flex-col shadow-none overflow-hidden">
      <CardHeader className="gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-hidden flex-1 min-h-0 flex">
        <ChatMessagesSkeleton />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-11 w-full" />
      </CardFooter>
    </Card>
  );
}

export { ConversationListSkeleton, ChatMessagesSkeleton, ChatWindowSkeleton };
