import { Skeleton } from "@/components/ui/skeleton";

export default function MovieDetailLoading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="w-full flex-shrink-0 md:w-1/3 lg:w-1/4">
          <Skeleton className="aspect-[2/3] w-full rounded-xl" />
        </div>
        <div className="flex w-full flex-col">
          <Skeleton className="mb-2 h-8 w-3/4" />
          <Skeleton className="mb-4 h-5 w-1/2" />
          
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-11 w-32 rounded-md" />
                <Skeleton className="h-11 w-24 rounded-md" />
                <Skeleton className="h-11 w-11 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>

      <div className="mt-8">
        <Skeleton className="mb-4 h-8 w-1/4" />
        <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
