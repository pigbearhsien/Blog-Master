"use client";

import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { owner: string } }) {
  // 如果 path 是 /owner，則自動導向 /owner/issue
  const router = useRouter();
  router.replace(`${params.owner}/issue`);
}
