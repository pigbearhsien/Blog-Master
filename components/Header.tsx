import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import SignButton from "./SighButton";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
import { CardStackIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <div className="px-8 flex h-16 items-center">
      <Link href="/" className="mr-2">
        <Image src="/logo.png" alt="Logo" width={25} height={25} />
      </Link>
      <Link href="/" className="mr-2">
        <Image src="/BlogMaster.png" alt="Logo" width={100} height={30} />
      </Link>
      <a
        href="https://github.com/pigbearhsien/blog-master"
        target="_blank"
        rel="noopener noreferrer"
        className="mr-4"
      >
        <Button
          aria-label="Blog Master GitHub Link"
          variant={"outline"}
          size={"icon"}
        >
          <GitHubLogoIcon className="h-4 w-4" />
        </Button>
      </a>
      <SearchBar />
      <section className="ml-auto flex items-center gap-1">
        {session && (
          <Link href="/">
            <Button aria-label="Your Issues" variant={"ghost"}>
              <CardStackIcon className="mr-2 h-5 w-5" />
              Your Issues
            </Button>
          </Link>
        )}
        <SignButton />
      </section>
    </div>
  );
}
