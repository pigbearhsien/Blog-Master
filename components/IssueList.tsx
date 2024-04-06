"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { GitHubIssue } from "@/lib/types/types";
import { dateTransform } from "@/lib/utils";
import { useOwnerAndRepo } from "@/lib/hooks/useOwnerAndRepo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import IssueActionButton from "@/components/IssueActionButton";

export default function IssueList({
  issues,
}: {
  issues: GitHubIssue[] | undefined;
}) {
  const router = useRouter();
  const { owner, currentRepo } = useOwnerAndRepo();
  const { data: session } = useSession();

  return (
    <>
      {issues?.map((issue: GitHubIssue) => (
        <Card
          key={issue.number}
          onClick={() =>
            router.push(`issue/${issue.number}?repo=${currentRepo}`)
          }
          className="hover:cursor-pointer hover:shadow-md mt-3"
        >
          <CardHeader className=" flex-row items-center justify-between pb-4">
            <CardDescription className="w-fit">
              <span className=" font-semibold">{`#${issue.number}  ·  `}</span>
              {dateTransform(issue.created_at as string).toString()}
            </CardDescription>
            {session?.user?.name === owner && (
              <IssueActionButton number={issue.number as number} />
            )}
          </CardHeader>
          <CardContent>
            <p className=" text-lg font-bold  overflow-hidden  line-clamp-2 text-ellipsis break-words">
              {issue.title}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
