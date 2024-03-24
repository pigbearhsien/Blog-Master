import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: {
        params: { scope: "public_repo" },
      },
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    // Upon user login, captures and save the access token returned by GitHub to the JWT.
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // Takes this access token from the JWT and adds it to the session object, so I can access the access token and use it to make requests to the GitHub API.
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
};
