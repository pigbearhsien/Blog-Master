import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import SignButton from "@/components/SighButton";
import SearchBar from "@/components/SearchBar";

export default async function WelcomePage() {
  const session = await getServerSession(authOptions);

  // 如果已登入，則導向使用者的主頁
  if (session) {
    redirect(`/${session.user.name}`);
  }

  return (
    <section className="flex flex-col gap-6">
      <Image src="/logo.png" alt="Blog Master" width={750} height={300} />
      <h1 className="text-3xl font-bold">Welcome to Blog Master</h1>
      <SearchBar />
      <SignButton />
    </section>
  );
}
