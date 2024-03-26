import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { GitHubIssue } from "./types/types";

// Helper function to retrieve the GitHub access token from the session.
async function getSessionToken() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.accessToken) {
      throw new Error("Session token not found.");
    }
    return session.user.accessToken;
  } catch (error) {
    console.error("Error retrieving session token:", error);
    throw error;
  }
}

// Helper function to make a fetch call to the GitHub API with necessary headers.
async function fetchGitHubAPI(
  endpoint: string,
  options: {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
  } = {}
) {
  try {
    const headers = {
      Accept: "application/vnd.github+json",
      ...options.headers,
    };

    const response = await fetch(`https://api.github.com${endpoint}`, {
      ...options,
      headers,
      // cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching GitHub API endpoint ${endpoint}:`, error);
    throw error;
  }
}

// Fetches public repositories for the specified user.
export async function getUserRepos({ owner }: GitHubIssue) {
  return await fetchGitHubAPI(`/users/${owner}/repos`);
}

// Lists issues in a specified repository.
export async function getRepoIssues({ owner, repo }: GitHubIssue) {
  return await fetchGitHubAPI(`/repos/${owner}/${repo}/issues`);
}

// Retrieves a specific issue from a repository.
export async function getIssue({ owner, repo, number }: GitHubIssue) {
  return await fetchGitHubAPI(`/repos/${owner}/${repo}/issues/${number}`);
}

// Fetches comments for a specific issue in a repository.
export async function getIssueComments({ owner, repo, number }: GitHubIssue) {
  return await fetchGitHubAPI(
    `/repos/${owner}/${repo}/issues/${number}/comments`
  );
}

// Creates an issue in a repository.
export async function createIssue({ owner, repo, title, body }: GitHubIssue) {
  const token = await getSessionToken();
  return await fetchGitHubAPI(`/repos/${owner}/${repo}/issues`, {
    method: "POST",
    body: JSON.stringify({ title, body }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

// Updates an issue in a repository.
export async function updateIssue({
  owner,
  repo,
  number,
  title,
  body,
}: GitHubIssue) {
  const token = await getSessionToken();
  return await fetchGitHubAPI(`/repos/${owner}/${repo}/issues/${number}`, {
    method: "PATCH",
    body: JSON.stringify({ title, body }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

// Closes an issue in a repository.
export async function closeIssue({ owner, repo, number }: GitHubIssue) {
  const token = await getSessionToken();
  return await fetchGitHubAPI(`/repos/${owner}/${repo}/issues/${number}`, {
    method: "PATCH",
    body: JSON.stringify({ state: "closed" }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
