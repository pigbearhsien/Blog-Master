import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import SignButton from "@/components/SighButton";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import SearchBar from "@/components/SearchBar";

export default async function WelcomePage() {
  const session = await getServerSession(authOptions);

  // 如果已登入，則導向使用者的主頁
  if (session) {
    redirect(`/${session.user.name}/issue`);
  }

  return (
    <section className="flex flex-col items-center relative gap-12">
      <div className="absolute p-4 left-0 flex items-center ">
        <Image
          src="/logo.png"
          alt="Logo"
          width={25}
          height={25}
          className="mr-2"
        />
        <Image
          src="/BlogMaster.png"
          alt="Logo"
          width={100}
          height={30}
          className=" mr-2"
        />
        <a
          aria-label="Blog Master GitHub Link"
          href="https://github.com/pigbearhsien/blog-master"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant={"outline"}
            size={"icon"}
            aria-label="Blog Master GitHub Link"
          >
            <GitHubLogoIcon className="h-4 w-4" />
          </Button>
        </a>
      </div>
      <Image
        src="/Cover.png"
        alt="background gradient image"
        width={1000}
        height={700}
        className="absolute -z-10 opacity-40 -mt-10"
      />
      <h1 className="text-5xl font-bold mt-52">
        A Blog Platform Powered by GitHub Issues.
      </h1>

      <p className="text-slate-500 font-light text-xl ">
        View, create, edit, and close GitHub issues.
      </p>
      <div className="flex items-center gap-3">
        <SignButton />
        <SearchBar />
      </div>
    </section>
  );
}
