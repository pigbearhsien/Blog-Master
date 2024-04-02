"use client";

export const dynamic = "force-dynamic";

import React from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { GitHubIssue } from "@/lib/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IssueActionButton from "./IssueActionButton";

export default function IssueList({
  issues,
}: {
  issues: GitHubIssue[] | undefined;
}) {
  const router = useRouter();
  const params = useParams<{ owner: string }>();
  const searchParams = useSearchParams();
  const currentRepo = searchParams.get("repo") as string;
  const { data: session } = useSession();

  return (
    <>
      {issues?.map((issue: GitHubIssue) => (
        <Card
          key={issue.number}
          onClick={() =>
            router.push(`issue/${issue.number}?repo=${currentRepo}`)
          }
          className="hover:cursor-pointer hover:shqdow-md mt-2"
        >
          <CardHeader className="flex">
            <CardTitle>#{issue.number}</CardTitle>
            {session?.user?.name === params.owner && (
              <IssueActionButton number={issue.number as number} />
            )}
          </CardHeader>
          <CardContent>
            <p>{issue.title}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
