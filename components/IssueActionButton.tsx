"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
import { useOwnerAndRepo } from "@/lib/hooks/useOwnerAndRepo";

export default function IssueActionButton({ number }: { number: number }) {
  const router = useRouter();
  const { owner, currentRepo, issueNumber } = useOwnerAndRepo();
  const { data: session } = useSession();

  const handleDeleteIssue = async () => {
    const { success } = await closeIssue(
      {
        owner,
        repo: currentRepo,
        number,
      },
      session?.user.accessToken as string
    );

    if (success) {
      toast.success("Issue deleted");
      if (issueNumber) router.push(`/${owner}/issue?repo=${currentRepo}`);

      router.refresh();
    } else {
      toast.error("Failed to delete issue");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Issue Actions"
        className="w-7 h-7 !outline-none !mt-0 hover:bg-accent hover:text-accent-foreground"
      >
        <DotsHorizontalIcon className="w-7" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          aria-label="Edit Issue"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/${owner}/issue/${number}/edit?repo=${currentRepo}`);
          }}
        >
          Edit issue
        </DropdownMenuItem>
        <DropdownMenuItem
          aria-label="Delete Issue"
          className="text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteIssue();
          }}
        >
          Delete issue
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
