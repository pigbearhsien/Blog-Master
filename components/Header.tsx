import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import SignButton from "./SighButton";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
import { CardStackIcon } from "@radix-ui/react-icons";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <div className="px-8 flex h-16 items-center">
      <Link href="/" className="mr-6">
        <Image
          src="/logo.png"
          alt="Logo"
          width={20}
          height={20}
          className=" opacity-80"
        />
      </Link>
      <SearchBar />
      <section className="ml-auto flex items-center gap-1">
        {session && (
          <Link href={`/${session.user.name}/issue`}>
            <Button variant={"ghost"}>
              <CardStackIcon className="mr-2 h-5 w-5" />
              My Issues
            </Button>
          </Link>
        )}
        <SignButton />
      </section>
    </div>
  );
}
