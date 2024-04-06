"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

const SignButton = () => {
  const { data: session } = useSession();

  return session ? (
    <Button
      aria-label="Sign out of GitHub"
      variant={"outline"}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign out of GitHub
    </Button>
  ) : (
    <Button
      aria-label="Sign in to GitHub"
      variant={"default"}
      onClick={() => signIn("github", { callbackUrl: "/" })}
    >
      Sign in to GitHub
    </Button>
  );
};

export default SignButton;
