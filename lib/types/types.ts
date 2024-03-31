export type GitHubIssue = {
  owner?: string;
  repo?: string;
  number?: number;
  title?: string;
  body?: string;
};

export type GitHubRepo = {
  name?: string;
  has_issues?: boolean;
  open_issues?: number;
};

export type GitHubUser = {
  login?: string; // GitHub username
  avatar_url?: string;
};
