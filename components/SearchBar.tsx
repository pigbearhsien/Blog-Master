"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/search-bar-input";

export default function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/${search}/issue`);
      }}
      className=" w-full max-w-md "
    >
      <Input
        type="text"
        placeholder="Search user"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  );
}
