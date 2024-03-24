import axios from "axios";

export const githubAxios = axios.create({
  baseURL: "https://api.github.com",
  headers: { Accept: "application/vnd.github+json" },
});
