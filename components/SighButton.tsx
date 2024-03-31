"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const SignButton = () => {
  const { data: session } = useSession();

  return session ? (
    <button
      className="bg-slate-600 px-4 py-2 text-white"
      onClick={() => signOut({ callbackUrl: "/" })}
      type="button"
    >
      Sign Out of GitHub
    </button>
  ) : (
    <button
      className="bg-slate-600 px-4 py-2 text-white"
      type="button"
      onClick={() => signIn("github", { callbackUrl: "/" })}
    >
      Sign In With GitHub
    </button>
  );
};

export default SignButton;
