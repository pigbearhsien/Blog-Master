import React from "react";
import Image from "next/image";

export default async function OwnerSection({
  name,
  avatarUrl,
}: {
  name: string | undefined;
  avatarUrl: string | undefined;
}) {
  return (
    <section className="flex flex-col items-center mb-6 min-w-full">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Owner avatar"
          width={100}
          height={100}
          className=" rounded-full mb-2"
        />
      ) : null}
      <p className=" font-semibold text-lg">{name}</p>
    </section>
  );
}
