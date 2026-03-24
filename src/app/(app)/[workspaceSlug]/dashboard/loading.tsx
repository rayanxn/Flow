import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="px-10 py-6">
      {/* Greeting */}
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-40 mb-8" />

      {/* Sprint strip */}
      <Skeleton className="h-24 w-full rounded-xl mb-8" />

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-5 w-32 mt-4" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
