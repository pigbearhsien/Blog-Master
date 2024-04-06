import React from "react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUser, getRepoIssues } from "@/lib/github-api";
import { GitHubIssue, GitHubRepo, GitHubUser } from "@/lib/types/types";
import RepoList from "@/components/RepoList";
import OwnerSection from "@/components/OwnerSection";
import IssueList from "@/components/IssueList";
import { redirect } from "next/navigation";
import LoadMore from "@/components/LoadMore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronRightIcon,
  ExternalLinkIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

export async function generateMetadata({
  params,
}: {
  params: { owner: string };
}): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  return {
    title: session?.user?.name === params.owner ? "Your Issues" : params.owner,
  };
}

export default async function MainPage({
  params,
  searchParams,
}: {
  params: { owner: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await getServerSession(authOptions);
  const selectedRepo = searchParams.repo;

  const { repos, userInfo, getUserError } = await getUser({
    owner: params.owner,
  });

  if (!repos || getUserError) {
    throw new Error(getUserError);
  }

  const reposCanHaveIssues = repos
    .filter(
      (repo: GitHubRepo) => repo.has_issues !== undefined && repo.has_issues
    )
    .sort(
      (a: GitHubRepo, b: GitHubRepo) =>
        (b.open_issues ?? 0) - (a.open_issues ?? 0)
    );

  if (reposCanHaveIssues.length > 0 && !selectedRepo)
    redirect(`?repo=${reposCanHaveIssues[0].name}`);

  // 如果選擇的 repo 不存在於 reposCanHaveIssues 陣列中，則顯示沒有找到 repos 的訊息
  if (
    selectedRepo &&
    !reposCanHaveIssues.find((repo: GitHubRepo) => repo.name === selectedRepo)
  ) {
    throw new Error("No repositories found.");
  }

  const { issues } = await getRepoIssues(
    {
      owner: params.owner,
      repo: selectedRepo,
    },
    1
  );

  return (
    <div className="container flex-1 items-start grid grid-cols-3 gap-10 px-20">
      <aside className="fixed top-16 z-30  hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block py-8">
        <div className="relative overflow-y-scroll h-full ">
          <OwnerSection name={params.owner} avatarUrl={userInfo.avatar_url} />
          <RepoList repos={reposCanHaveIssues} selectedRepo={selectedRepo} />
        </div>
      </aside>
      <section className="col-span-2 relative py-8 px-2 ">
        {selectedRepo && (
          <>
            <div className="flex items-center mb-4 h-8">
              <span className="font-light text-slate-500">{params.owner} </span>
              <ChevronRightIcon className=" inline-flex mx-2" />
              <span>{selectedRepo}</span>
              <a
                href={`https://github.com/${params.owner}/${selectedRepo}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  aria-label="View the Current Repo on GitHub"
                  variant={"ghost"}
                  size={"icon"}
                >
                  <ExternalLinkIcon />
                </Button>
              </a>
              {session?.user?.name === params.owner && (
                <Link
                  href={`/${params.owner}/issue/new?repo=${selectedRepo}`}
                  className="ml-auto"
                >
                  <Button
                    aria-label="Create New Issue"
                    className=" bg-[#1A8917] hover:bg-[#1A8917]/90"
                  >
                    <PlusIcon className="mr-2" />
                    New Issue
                  </Button>
                </Link>
              )}
            </div>
            {issues?.length === 0 ? (
              <p className=" text-lg font-semibold ">No issues found.</p>
            ) : (
              <>
                <IssueList issues={issues} />
                {issues.length >= 10 && <LoadMore />}
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
