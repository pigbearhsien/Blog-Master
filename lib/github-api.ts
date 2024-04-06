import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { GitHubIssue, GitHubRepo } from "@/lib/types/types";
import { getErrorMessage } from "@/lib/utils";

// Helper function to make a fetch call to the GitHub API with necessary headers.
async function fetchGitHubAPI(
  endpoint: string,
  options: {
    method?: string;
    body?: string;
    headers?: Record<string, string> | {};
  } = {} // 如果在呼叫函數時沒有提供 options 參數，那麼 options 將會是一個空物件。
) {
  try {
    const headers = {
      Accept: "application/vnd.github+json",
      ...options.headers,
    };

    const response = await fetch(`https://api.github.com${endpoint}`, {
      ...options, // 將 options 物件的所有屬性添加到新的物件中
      headers, // 覆蓋 options 物件中的 headers 屬性
      // cache: "no-store", // 不使用緩存
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
  const session = await getServerSession(authOptions);
  const headers = session
    ? { Authorization: `Bearer ${session.user.accessToken}` }
    : {};
  try {
    let page = 1;
    let repos: GitHubRepo[] = [];
    while (true) {
      const newRepos = await fetchGitHubAPI(
        `/users/${owner}/repos?per_page=100&page=${page}`,
        {
          method: "GET",
          headers,
        }
      );
      repos = repos.concat(newRepos);
      if (newRepos.length < 100) {
        break;
      }
      page++;
    }
    const userInfo = await fetchGitHubAPI(`/users/${owner}`, {
      method: "GET",
      headers,
    });
    return { repos, userInfo };
  } catch (error) {
    return { getUserError: getErrorMessage(error) };
  }
}

// Lists issues in a specified repository.
export async function getRepoIssues(
  { owner, repo }: GitHubIssue,
  page: number = 1,
  token?: string
) {
  // 如果是在 client component 中呼叫這個函數，則會傳入 token 參數
  // 如果是用戶未登入，則 token 會是 “” 空字串
  let session;

  if (token !== undefined) {
    // client component
    session = token.length !== 0 ? { user: { accessToken: token } } : undefined;
  } else {
    // server component
    session = await getServerSession(authOptions);
  }

  const headers = session
    ? { Authorization: `Bearer ${session.user.accessToken}` }
    : {};
  const perPage = 10;
  try {
    const issues = await fetchGitHubAPI(
      `/repos/${owner}/${repo}/issues?page=${page}&per_page=${perPage}`,
      {
        method: "GET",
        headers,
      }
    );
    return { issues };
  } catch (error) {
    return { getRepoIssuesError: getErrorMessage(error) };
  }
}

// Retrieves a specific issue from a repository.
export async function getIssue({ owner, repo, number }: GitHubIssue) {
  const session = await getServerSession(authOptions);
  const headers = session
    ? { Authorization: `Bearer ${session.user.accessToken}` }
    : {};
  try {
    const issue = await fetchGitHubAPI(
      `/repos/${owner}/${repo}/issues/${number}`,
      {
        method: "GET",
        headers,
      }
    );
    return { issue };
  } catch (error) {
    return { getIssueError: getErrorMessage(error) };
  }
}

// Fetches comments for a specific issue in a repository.
export async function getIssueComments({ owner, repo, number }: GitHubIssue) {
  const session = await getServerSession(authOptions);
  const headers = session
    ? { Authorization: `Bearer ${session.user.accessToken}` }
    : {};
  try {
    const comments = await fetchGitHubAPI(
      `/repos/${owner}/${repo}/issues/${number}/comments`,
      {
        method: "GET",
        headers,
      }
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
