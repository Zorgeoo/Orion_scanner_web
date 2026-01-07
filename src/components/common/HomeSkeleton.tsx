import { Skeleton } from "@/components/ui/skeleton";

export default function HomeSkeleton() {
  return (
    <div className="space-y-2 flex flex-col items-center">
      <Skeleton className="h-4 w-[180px]" />
      <Skeleton className="h-4 w-[180px]" />
      <Skeleton className="h-4 w-[180px]" />
    </div>
  );
}
