import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getIssue } from "@/lib/github-api";
import Editor from "@/components/IssueEditor";

export default async function IssuePage({
  params,
  searchParams,
}: {
  params: { owner: string; number: number };
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await getServerSession(authOptions);
  const selectedRepo = searchParams.repo;

  // 只能在登入後編輯自己的 issue
  if (params.owner !== session?.user?.name) {
    throw new Error("You are not authorized to edit this issue");
  }

  const { issue, getIssueError } = await getIssue({
    owner: params.owner,
    number: params.number,
    repo: selectedRepo,
  });

  if (getIssueError) {
    throw new Error(getIssueError);
  }

  return (
    <>
      <p>You are editing {issue.number}</p>
      <div className=" px-36 pt-8">
        <Editor
          initialTitle={issue.title}
          initialBody={issue.body}
          number={params.number}
        />
      </div>
    </>
  );
}
