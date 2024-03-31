"use client";

import React from "react";
import { GitHubIssue } from "@/lib/types/types";

export default function IssueList({
  issues,
}: {
  issues: GitHubIssue[] | undefined;
}) {
  return (
    <>
      <ul>
        {issues?.map((issue: GitHubIssue) => (
          <li key={issue.number}>
            <h2>Issue #{issue.number}</h2>
            <p>{issue.title}</p>
            <p>{issue.body}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
