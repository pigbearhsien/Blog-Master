import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import SignButton from "./SighButton";
import SearchBar from "./SearchBar";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex h-16 items-center px-6 border-b">
      <Link href="/" className="text-xl font-bold mr-6">
        <Image src="/logo.png" alt="Blog Master" width={75} height={30} />
      </Link>
      <SearchBar />
      <section className="ml-auto flex items-center gap-3">
        {session && (
          <>
            <Link href="/create">Create Post</Link>
            <Link href={`${session.user.name}`}>My Repos</Link>
          </>
        )}
        <SignButton />
      </section>
    </div>
  );
}
