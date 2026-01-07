import { Skeleton } from "@/components/ui/skeleton";

export default function HomeSkeleton() {
  return (
    <div className="space-y-2 flex flex-col items-center content-center pt-16">
      <Skeleton className="h-16 w-[240px]" />
      <Skeleton className="h-16 w-[240px]" />
      <Skeleton className="h-16 w-[240px]" />
    </div>
  );
}
