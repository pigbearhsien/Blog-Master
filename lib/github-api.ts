import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { GitHubIssue, GitHubRepo, GitHubUser } from "@/lib/types/types";
import { getErrorMessage } from "@/lib/utils";
import { getToken } from "next-auth/jwt";

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
  } = {} // 如果在呼叫函數時沒有提供 options 參數，那麼 options 將會是一個空物件。
) {
  // const token = await getSessionToken();
  try {
    const headers = {
      Accept: "application/vnd.github+json",
      ...options.headers,
      // Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`https://api.github.com${endpoint}`, {
      ...options, // 將 options 物件的所有屬性添加到新的物件中
      headers, // 覆蓋 options 物件中的 headers 屬性
      cache: "no-store", // 不使用緩存
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Fetches public repositories for the specified user.
export async function getUser({ owner }: GitHubIssue) {
  try {
    let page = 1;
    let repos: GitHubRepo[] = [];
    while (true) {
      const newRepos = await fetchGitHubAPI(
        `/users/${owner}/repos?per_page=100&page=${page}`
      );
      repos = repos.concat(newRepos);
      if (newRepos.length < 100) {
        break;
      }
      page++;
    }
    const userInfo = await fetchGitHubAPI(`/users/${owner}`);
    return { repos, userInfo };
  } catch (error) {
    return { getUserError: getErrorMessage(error) };
  }
}

// Lists issues in a specified repository.
export async function getRepoIssues(
  { owner, repo }: GitHubIssue,
  page: number = 1
) {
  const perPage = 10;
  try {
    const issues = await fetchGitHubAPI(
      `/repos/${owner}/${repo}/issues?page=${page}&per_page=${perPage}`
    );
    return { issues };
  } catch (error) {
    return { getRepoIssuesError: getErrorMessage(error) };
  }
}

// Retrieves a specific issue from a repository.
export async function getIssue({ owner, repo, number }: GitHubIssue) {
  try {
    const issue = await fetchGitHubAPI(
      `/repos/${owner}/${repo}/issues/${number}`
    );
    return { issue };
  } catch (error) {
    return { getIssueError: getErrorMessage(error) };
  }
}

// Fetches comments for a specific issue in a repository.
export async function getIssueComments({ owner, repo, number }: GitHubIssue) {
  try {
    const comments = await fetchGitHubAPI(
      `/repos/${owner}/${repo}/issues/${number}/comments`
    );
    return { comments };
  } catch (error) {
    return { getCommentsError: getErrorMessage(error) };
  }
}

// Creates an issue in a repository.
export async function createIssue(
  { owner, repo, title, body }: GitHubIssue,
  token: string
) {
  // const token = await getSessionToken();
  try {
    const newIssue = await fetchGitHubAPI(`/repos/${owner}/${repo}/issues`, {
      method: "POST",
      body: JSON.stringify({ title, body }),
      headers: {
        "Content-Type": "application/json", // "Content-Type" 告訴伺服器你正在發送什麼類型的數據，"application/json" 表示你正在發送 JSON 數據
        Authorization: `Bearer ${token}`,
      },
    });
    return { newIssue };
  } catch (error) {
    return { createIssueError: getErrorMessage(error) };
  }
}

// Updates an issue in a repository.
export async function updateIssue(
  { owner, repo, number, title, body }: GitHubIssue,
  token: string
) {
  // const token = await getSessionToken();
  try {
    const updateIssue = await fetchGitHubAPI(
      `/repos/${owner}/${repo}/issues/${number}`,
      {
        method: "PATCH",
        body: JSON.stringify({ title, body }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { updateIssue };
  } catch (error) {
    return { updateIssueError: getErrorMessage(error) };
  }
}

// Closes an issue in a repository.
export async function closeIssue(
  { owner, repo, number }: GitHubIssue,
  token: string
) {
  // const token = await getSessionToken();
  // const token = await getToken({ req: authOptions });
  try {
    await fetchGitHubAPI(`/repos/${owner}/${repo}/issues/${number}`, {
      method: "PATCH",
      body: JSON.stringify({ state: "closed" }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
