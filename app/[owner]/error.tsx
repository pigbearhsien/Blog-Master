"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <>
      <h2 className="text-2xl mb-4 font-semibold w-fit mx-auto  mt-[20vh]">
        {error.message}
      </h2>
      <div className="flex items-center gap-3 w-fit mx-auto">
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
        <Button variant={"outline"} onClick={() => router.back()}>
          Back
        </Button>
      </div>
    </>
  );
}
