import { Skeleton } from "@/components/ui/skeleton";

export default function HomeSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[180px]" />
      <Skeleton className="h-4 w-[220px]" />
    </div>
  );
}
