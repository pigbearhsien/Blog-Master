import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default async function OwnerSection({
  name,
  avatarUrl,
}: {
  name: string | undefined;
  avatarUrl: string | undefined;
}) {
  return (
    <section className="flex flex-col items-center mb-6 gap-4 min-w-full">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Owner avatar"
          width={100}
          height={100}
          className=" rounded-full "
        />
      ) : null}
      <p className=" font-semibold text-lg">{name}</p>
      <Link href={`https://github.com/${name}`} passHref legacyBehavior>
        <a target="_blank" rel="noopener noreferrer">
          <Button
            className="mb-2 text-[#1A8917] hover:text-[#1A8917] border-[#1A8917] hover:border-[#1A8917]"
            variant={"outline"}
          >
            View GitHub
          </Button>
        </a>
      </Link>
    </section>
  );
}
