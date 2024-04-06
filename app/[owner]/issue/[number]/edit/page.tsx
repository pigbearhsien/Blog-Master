import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getIssue } from "@/lib/github-api";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { owner: string; number: number };
  searchParams: { [key: string]: string | undefined };
}): Promise<Metadata> {
  const { issue } = await getIssue({
    owner: params.owner,
    number: params.number,
    repo: searchParams.repo,
  });
  return {
    title: `Editing ${issue?.title}` ?? "Editing",
    description: issue?.body ?? "",
  };
}

const Editor = dynamic(() => import("@/components/IssueEditor"), {
  ssr: false,
});

export default async function IssuePage({
  params,
  searchParams,
}: {
  params: { owner: string; number: number };
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await getServerSession(authOptions);
  const selectedRepo = searchParams.repo;

  // 登入後才能編輯自己的 issue
  if (params.owner !== session?.user?.name) {
    throw new Error("You are not authorized.");
  }

  const { issue, getIssueError } = await getIssue({
    owner: params.owner,
    number: params.number,
    repo: selectedRepo,
  });

  if (getIssueError) {
    throw new Error(getIssueError);
  }

  if (issue && issue.state !== "open") {
    throw new Error("Issue is closed.");
  }

  return (
    <article className="container flex-1 items-start px-72 py-12">
      <Editor
        initialTitle={issue.title}
        initialBody={issue.body}
        number={params.number}
      />
    </article>
  );
}
