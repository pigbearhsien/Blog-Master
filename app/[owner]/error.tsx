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
      <h2 className="text-2xl mb-4 font-semibold w-fit mx-auto  mt-[20vh] px-10">
        {error.message}
      </h2>
      <p className="text-lg mb-8 font-medium w-fit mx-auto  px-10">
        If you receive 403 rate limit error, please sign in to GitHub to get a
        higher rate limit and try again.
      </p>
      <div className="flex items-center gap-3 w-fit mx-auto">
        <Button
          aria-label="Try Again"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
        <Button
          aria-label="Back to Previous Page"
          variant={"outline"}
          onClick={() => router.back()}
        >
          Back
        </Button>
      </div>
    </>
  );
}
