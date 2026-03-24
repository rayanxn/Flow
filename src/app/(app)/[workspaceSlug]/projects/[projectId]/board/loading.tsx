import { Skeleton } from "@/components/ui/skeleton";

export default function BoardLoading() {
  return (
    <div className="flex gap-5 p-6 overflow-x-auto">
      {["Todo", "In Progress", "In Review", "Done"].map((col) => (
        <div key={col} className="w-72 shrink-0">
          <Skeleton className="h-5 w-24 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
