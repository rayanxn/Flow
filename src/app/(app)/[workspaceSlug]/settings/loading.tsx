import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="max-w-lg">
      <Skeleton className="h-7 w-32 mb-2" />
      <Skeleton className="h-4 w-64 mb-8" />

      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-11 w-full rounded-[10px]" />
          </div>
        ))}
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}
