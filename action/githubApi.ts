import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { githubAxios } from "@/lib/util";

async function getSessionToken() {
  const session = await getServerSession(authOptions);
  return session?.user?.accessToken;
}

// Lists public repositories for the specified user
export const getUserRepos = async (userName: string) =>
  githubAxios.get(`/users/${userName}/repos`);

// List issues in a repository
export const getRepoIssues = async (owner: string, repo: string) =>
  githubAxios.get(`/repos/${owner}/${repo}/issues`);

// Get an Issue
export const getIssue = async (
  owner: string,
  repo: string,
  issueNumber: number
) => githubAxios.get(`/repos/${owner}/${repo}/issues/${issueNumber}`);

// List comments on an issue
export const getIssueComments = async (
  owner: string,
  repo: string,
  issueNumber: number
) => githubAxios.get(`/repos/${owner}/${repo}/issues/${issueNumber}/comments`);

// Create an issue
export const createIssue = async (owner: string, repo: string, data: any) => {
  const token = await getSessionToken();
  return githubAxios.post(`/repos/${owner}/${repo}/issues`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update an issue
export const updateIssue = async (
  owner: string,
  repo: string,
  issueNumber: number,
  data: any
) => {
  const token = await getSessionToken();
  githubAxios.patch(`/repos/${owner}/${repo}/issues/${issueNumber}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Close an issue
export const closeIssue = async (
  owner: string,
  repo: string,
  issueNumber: number
) => {
  const token = await getSessionToken();
  githubAxios.patch(
    `/repos/${owner}/${repo}/issues/${issueNumber}`,
    {
      state: "closed",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
