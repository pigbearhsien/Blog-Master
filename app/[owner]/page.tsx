import React from "react";
import { getUser, getRepoIssues } from "@/lib/github-api";
import { GitHubIssue, GitHubRepo, GitHubUser } from "@/lib/types/types";
import RepoList from "@/components/RepoList";
import OwnerSection from "@/components/OwnerSection";
import IssueList from "@/components/IssueList";
import { redirect } from "next/navigation";
import LoadMore from "@/components/LoadMore";

export default async function MainPage({
  params,
  searchParams,
}: {
  params: { owner: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const selectedRepo = searchParams.repo;

  const { repos, userInfo, getUserError } = await getUser({
    owner: params.owner,
  });

  // Error handling
  if (getUserError) {
    throw new Error(getUserError);
  }

  const reposCanHaveIssues = repos
    .filter((repo: GitHubRepo) => repo.has_issues) // 篩選 repos 陣列，只保留每個物件的 has_issue 屬性為 true 的物件，不然會沒辦法 create issue
    .sort(
      (a: { open_issues: any }, b: { open_issues: any }) =>
        (b.open_issues ?? 0) - (a.open_issues ?? 0)
    ); // 將篩選後的 repos 陣列按照 issues 的數量排序

  // 預設選擇的 repo 是 reposCanHaveIssues 陣列的第一個物件
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
    <main className="flex">
      <section className="w-1/4">
        <OwnerSection name={params.owner} avatarUrl={userInfo.avatar_url} />
        <RepoList repos={reposCanHaveIssues} selectedRepo={selectedRepo} />
      </section>
      <section className="w-3/4">
        {selectedRepo && <h1>Selected Repo: {selectedRepo}</h1>}
        {issues?.length === 0 ? (
          <p>No issues found.</p>
        ) : (
          <>
            <IssueList issues={issues} />
            {issues.length >= 10 && <LoadMore />}
          </>
        )}
      </section>
    </main>
  );
}
