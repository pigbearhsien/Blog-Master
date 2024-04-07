import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { dateTransform } from "@/lib/utils";
import { getUser, getIssue, getIssueComments } from "@/lib/github-api";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import IssueActionButton from "@/components/IssueActionButton";
import CommentSheet from "@/components/CommentSheet";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { owner: string; number: number };
  searchParams: { [key: string]: string | undefined };
}): Promise<Metadata> {
  const { issue } = await getIssue({
    owner: params.owner,
    number: params.number,
    repo: searchParams.repo,
  });
  return {
    title: `${issue?.title} | by ${params.owner}` ?? "Issue",
    description: issue?.body ?? "",
  };
}

const Viewer = dynamic(() => import("@/components/IssueViewer"), {
  ssr: false,
});

export default async function IssuePage({
  params,
  searchParams,
}: {
  params: { owner: string; number: number };
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await getServerSession(authOptions);
  const selectedRepo = searchParams.repo;
  const { userInfo, getUserError } = await getUser({
    owner: params.owner,
  });

  if (!userInfo || getUserError) {
    throw new Error(getUserError);
  }

  const { issue, getIssueError } = await getIssue({
    owner: params.owner,
    number: params.number,
    repo: selectedRepo,
  });

  if (getIssueError) {
    throw new Error(getIssueError);
  }

  if (issue && issue.state !== "open") {
    throw new Error("Issue is closed.");
  }

  const { comments, getCommentsError } = await getIssueComments({
    owner: params.owner,
    number: params.number,
    repo: selectedRepo,
  });

  if (getCommentsError) {
    throw new Error(getCommentsError);
  }

  return (
    <article className="container flex-1 items-start px-72 py-12">
      <p className=" font-bold text-5xl break-words p-2">{issue?.title}</p>

      <section className="flex items-center  py-9">
        <Image
          src={userInfo.avatar_url}
          alt="Owner avatar"
          width={40}
          height={40}
          className=" rounded-full mr-4"
        />

        <div className="flex flex-col  mr-auto">
          <div className="flex items-center">
            <a
              aria-label="View the Owner's Issues"
              href={`/${params.owner}/issue`}
              className="w-fit"
            >
              <span className="  font-light hover:border-b hover:border-black">
                {params.owner}
              </span>
            </a>
            <a
              aria-label="View the Owner on GitHub"
              href={`https://github.com/${params.owner}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                aria-label="View the Owner on GitHub"
                variant={"ghost"}
                size={"icon"}
              >
                <ExternalLinkIcon />
              </Button>
            </a>
          </div>

          <p className="font-light text-slate-500 text-sm">
            Created in{" "}
            <a
              aria-label="View the Current Repo's Issues"
              href={`/${params.owner}/issue?repo=${selectedRepo}`}
            >
              <span className="  font-light hover:border-b hover:border-black text-black  ">
                {selectedRepo}
              </span>
            </a>{" "}
            · {dateTransform(issue.created_at)}
          </p>
        </div>

        <div className="flex items-center  text-slate-800 font-light">
          <CommentSheet comments={comments} />
          <a
            aria-label="View the Issue on GitHub"
            href={`https://github.com/${params.owner}/${selectedRepo}/issues/${params.number}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              aria-label="View the Issue on GitHub"
              variant={"ghost"}
              size={"icon"}
            >
              <ExternalLinkIcon />
            </Button>
          </a>
          {session?.user?.name === params.owner && (
            <IssueActionButton number={params.number} />
          )}
        </div>
      </section>

      <Separator className="mb-6" />

      <Viewer body={issue?.body} />
    </article>
  );
}
