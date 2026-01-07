import { Skeleton } from "@/components/ui/skeleton";

export default function ListSkeleton() {
  return (
    <div className="space-y-2 flex flex-col items-center content-center">
      <Skeleton className="h-8 w-[180px]" />
      <Skeleton className="h-8 w-[180px]" />
      <Skeleton className="h-8 w-[180px]" />
      <Skeleton className="h-8 w-[180px]" />
      <Skeleton className="h-8 w-[180px]" />
      <Skeleton className="h-8 w-[180px]" />
      <Skeleton className="h-8 w-[180px]" />
      <Skeleton className="h-8 w-[180px]" />
      <Skeleton className="h-8 w-[180px]" />
    </div>
  );
}
