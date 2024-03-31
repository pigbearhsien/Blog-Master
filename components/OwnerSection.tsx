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
    <>
      {avatarUrl ? (
        <Image src={avatarUrl} alt="Owner avatar" width={100} height={100} />
      ) : null}
      <p>{name}</p>
    </>
  );
}
