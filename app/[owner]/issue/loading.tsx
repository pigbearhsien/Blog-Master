import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container flex-1 items-start grid grid-cols-3 gap-10 px-20">
      <aside className="fixed top-16 z-30  hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block py-8">
        <div className="relative overflow-y-scroll h-full ">
          <div className="flex flex-col items-center mb-10 gap-4 min-w-full">
            <Skeleton className=" h-28 w-28 rounded-full" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          <Skeleton className="mt-2 h-6 w-2/3" />
          <Skeleton className="mt-2 h-6 w-1/3" />
          <Skeleton className="mt-2 h-6 w-1/2" />
        </div>
      </aside>
      <section className="col-span-2 relative py-8 px-2 ">
        <Skeleton className="mb-4 h-8 w-1/3" />
        <div className="space-y-3">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <Skeleton className="h-[125px] w-full rounded-xl" />
        </div>
      </section>
    </div>
  );
}
