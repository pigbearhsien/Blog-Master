import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import { getIssue, getIssueComments } from "@/lib/github-api";
import IssueActionButton from "@/components/IssueActionButton";
import { GitHubIssueComment } from "@/lib/types/types";
import Viewer from "@/components/IssueViewer";

export default async function IssuePage({
  params,
  searchParams,
}: {
  params: { owner: string; number: number };
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await getServerSession(authOptions);

  const selectedRepo = searchParams.repo;

  const { issue, getIssueError } = await getIssue({
    owner: params.owner,
    number: params.number,
    repo: selectedRepo,
  });

  if (getIssueError) {
    throw new Error(getIssueError);
  }

  const { comments, getCommentsError } = await getIssueComments({
    owner: params.owner,
    number: params.number,
    repo: selectedRepo,
  });

  if (getCommentsError) {
    throw new Error(getCommentsError);
  }

  return (
    <>
      {session?.user?.name === params.owner && (
        <IssueActionButton number={params.number} />
      )}
      <p>#{issue?.number}</p>
      <p>Date: {issue.created_at}</p>
      <p>Owner: {issue?.user?.login}</p>
      <Image
        src={issue?.user?.avatar_url}
        alt={issue?.user?.login}
        width={50}
        height={50}
      />
      <p>Repo: {selectedRepo}</p>
      <p>Title: {issue?.title}</p>
      <Viewer body={issue?.body} />
      <br />
      <div>
        {comments?.map((comment: GitHubIssueComment) => (
          <div key={comment.id}>
            <p>{comment.user?.login}</p>
            <Viewer body={comment.body} />
          </div>
        ))}
      </div>
    </>
  );
}
