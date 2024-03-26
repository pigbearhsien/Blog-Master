import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { githubAxios } from "@/lib/utils";
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
    throw error; // Rethrowing the error after logging it to handle it further up the call stack.
  }
}

// Function to configure GitHub Axios instance with the necessary Authorization header.
async function configureGitHubAxios() {
  try {
    const token = await getSessionToken();
    githubAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } catch (error) {
    console.error("Error configuring GitHub Axios instance:", error);
    throw error;
  }
}

// Fetches public repositories for the specified user.
export async function getUserRepos({ owner }: GitHubIssue) {
  try {
    return await githubAxios.get(`/users/${owner}/repos`);
  } catch (error) {
    console.error(`Error fetching repositories for user ${owner}:`, error);
    throw error;
  }
}

// Lists issues in a specified repository.
export async function getRepoIssues({ owner, repo }: GitHubIssue) {
  try {
    return await githubAxios.get(`/repos/${owner}/${repo}/issues`);
  } catch (error) {
    console.error(
      `Error fetching issues for repository ${owner}/${repo}:`,
      error
    );
    throw error;
  }
}

// Retrieves a specific issue from a repository.
export async function getIssue({ owner, repo, number }: GitHubIssue) {
  try {
    return await githubAxios.get(`/repos/${owner}/${repo}/issues/${number}`);
  } catch (error) {
    console.error(
      `Error fetching issue ${number} for repository ${owner}/${repo}:`,
      error
    );
    throw error;
  }
}

// Fetches comments for a specific issue in a repository.
export async function getIssueComments({ owner, repo, number }: GitHubIssue) {
  try {
    return await githubAxios.get(
      `/repos/${owner}/${repo}/issues/${number}/comments`
    );
  } catch (error) {
    console.error(
      `Error fetching comments for issue ${number} in repository ${owner}/${repo}:`,
      error
    );
    throw error;
  }
}

// Creates an issue in a repository.
export async function createIssue({ owner, repo, title, body }: GitHubIssue) {
  try {
    await configureGitHubAxios();
    return await githubAxios.post(`/repos/${owner}/${repo}/issues`, {
      title,
      body,
    });
  } catch (error) {
    console.error(
      `Error creating issue in repository ${owner}/${repo}:`,
      error
    );
    throw error;
  }
}

// Updates an issue in a repository.
export async function updateIssue({
  owner,
  repo,
  number,
  title,
  body,
}: GitHubIssue) {
  try {
    await configureGitHubAxios();
    return await githubAxios.patch(`/repos/${owner}/${repo}/issues/${number}`, {
      title,
      body,
    });
  } catch (error) {
    console.error(
      `Error updating issue ${number} in repository ${owner}/${repo}:`,
      error
    );
    throw error;
  }
}

// Closes an issue in a repository.
export async function closeIssue({ owner, repo, number }: GitHubIssue) {
  try {
    await configureGitHubAxios();
    return await githubAxios.patch(`/repos/${owner}/${repo}/issues/${number}`, {
      state: "closed",
    });
  } catch (error) {
    console.error(
      `Error closing issue ${number} in repository ${owner}/${repo}:`,
      error
    );
    throw error;
  }
}
