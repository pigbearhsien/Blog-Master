"use client";

export const dynamic = "force-dynamic";

import React from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { GitHubIssue } from "@/lib/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const dateTransform = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
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
            {session?.user?.name === params.owner && (
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
