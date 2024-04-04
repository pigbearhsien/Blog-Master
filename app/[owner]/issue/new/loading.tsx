import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className=" text-center mt-[30vh]">
      <Spinner />
    </div>
  );
}
