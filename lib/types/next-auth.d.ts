import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  // interface Session {
  //   user: {
  //     name?: string | null | undefined;
  //     email?: string | null | undefined;
  //     image?: string | null | undefined;
  //     accessToken: any  & DefaultSession["user"];
  //   };
  // }
  // interface User {
  //   accessToken: any & DefaultSession["user"];
  // }
  interface Session {
    user: {
      accessToken: any;
    } & DefaultSession["user"];
  }
}
