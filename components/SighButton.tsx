"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

const SignButton = () => {
  const { data: session } = useSession();

  return session ? (
    <Button variant={"outline"} onClick={() => signOut({ callbackUrl: "/" })}>
      Sign out of GitHub
    </Button>
  ) : (
    <Button
      variant={"default"}
      onClick={() => signIn("github", { callbackUrl: "/" })}
    >
      Sign in to GitHub
    </Button>
  );
};

export default SignButton;
