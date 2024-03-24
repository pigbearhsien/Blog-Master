import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import SignInButton from "./SighInButton";
import SignOutButton from "./SighOutButton";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-6 gap-5">
        <Link href="/">
          <h1 className="text-xl font-bold">Blog Master</h1>
        </Link>
        <div className="flex items-center">
          <h3 className="text-xl font-bold">a search bar</h3>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {session ? (
            <>
              <Link href="/home">
                <button className="bg-slate-600 px-4 py-2 text-white">
                  Home
                </button>
              </Link>
              <SignOutButton />
            </>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </div>
  );
}
