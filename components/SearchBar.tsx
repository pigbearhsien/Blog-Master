"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`${search}`);
      }}
      className="flex w-full max-w-sm items-center space-x-2"
    >
      <Input
        type="search"
        placeholder="Search user"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* Since the button is of type "submit", clicking it or pressing Enter will submit the form */}
      <Button type="submit">Search</Button>
    </form>
  );
}
