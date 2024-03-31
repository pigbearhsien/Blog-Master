import React from "react";
import Link from "next/link";
import { GitHubRepo } from "@/lib/types/types";

type RepoListProps = {
  repos: GitHubRepo[];
  selectedRepo: string | undefined;
};

export default function RepoList({ repos, selectedRepo }: RepoListProps) {
  return (
    <>
      <h1>Repositories</h1>
      {repos?.length === 0 ? (
        // 如果 reposCanHaveIssues 陣列為空，則顯示沒有找到 repos 的訊息
        <p>No public repositories yet.</p>
      ) : (
        <ul>
          {repos.map((repo: GitHubRepo) => (
            <li
              key={repo.name}
              className={` ${repo.name === selectedRepo ? "text-red-500" : ""}`}
            >
              <Link href={`?repo=${repo.name}`}>
                {repo.name} ({repo.open_issues})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
