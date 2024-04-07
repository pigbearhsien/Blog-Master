import React from "react";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserRepos } from "@/lib/github-api";
import { GitHubRepo } from "@/lib/types/types";

export async function generateMetadata() {
  return {
    title: "New Issue",
  };
}

const Editor = dynamic(() => import("@/components/IssueEditor"), {
  ssr: false,
});

export default async function IssuePage({
  params,
  searchParams,
}: {
  params: { owner: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await getServerSession(authOptions);
  const selectedRepo = searchParams.repo;

  // 只能在登入後自己的 repo 中建立新的 issue
  if (params.owner !== session?.user?.name) {
    throw new Error("You are not authorized to create a new issue.");
  }

  const { repos } = await getUserRepos({
    owner: params.owner,
  });

  if (!repos) {
    throw new Error("Please select a valid repository to create an issue.");
  }
  const reposCanHaveIssues = repos?.filter(
    (repo: GitHubRepo) => repo.has_issues
  );

  // 必須選擇一個 repo 且該 repo 必須可以建立 issue
  if (
    !selectedRepo ||
    !reposCanHaveIssues.find((repo: GitHubRepo) => repo.name === selectedRepo)
  ) {
    throw new Error("Please select a valid repository to create an issue.");
  }

  return (
    <div className="container flex-1 items-start px-72 py-12">
      <Editor
        initialTitle={undefined}
        initialBody={undefined}
        number={undefined}
      />
    </div>
  );
}
