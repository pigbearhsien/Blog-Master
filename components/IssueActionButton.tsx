"use client";

import React from "react";
import {
  useRouter,
  useSearchParams,
  useParams,
  usePathname,
} from "next/navigation";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { closeIssue } from "@/lib/github-api";
import toast from "react-hot-toast";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

export default function IssueActionButton({ number }: { number: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ owner: string }>();
  const searchParams = useSearchParams();
  const currentRepo = searchParams.get("repo") as string;
  const { data: session } = useSession();
  const handleDeleteIssue = async () => {
    const { success } = await closeIssue(
      {
        owner: params.owner,
        repo: currentRepo,
        number,
      },
      session?.user.accessToken as string
    );

    if (success) {
      toast.success("Issue deleted");
      if (pathname.includes(`${number}`))
        router.push(`/${params.owner}/issue?repo=${currentRepo}`);

      router.refresh();
    } else {
      toast.error("Failed to delete issue");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-7 h-7 !outline-none !mt-0 hover:bg-accent hover:text-accent-foreground">
        <DotsHorizontalIcon className="w-7" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            router.push(
              `/${params.owner}/issue/${number}/edit?repo=${currentRepo}`
            );
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="font-red-500"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteIssue();
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
