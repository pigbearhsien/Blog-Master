"use client";

import Image from "next/image";
import { GitHubIssueComment } from "@/lib/types/types";
import { dateTransform } from "@/lib/utils";
import { ChatBubbleIcon, Cross1Icon } from "@radix-ui/react-icons";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Viewer from "@/components/IssueViewer";

export default function CommentSheet({
  comments,
}: {
  comments: GitHubIssueComment[];
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="View Comments"
          variant={"ghost"}
          className="text-base font-extralight gap-1 items-center"
          size={"icon"}
        >
          <ChatBubbleIcon />
          {comments?.length ?? 0}
        </Button>
      </SheetTrigger>
      <SheetContent side={"right"} className="p-0 overflow-y-scroll">
        <SheetHeader>
          <SheetTitle className="p-6 pb-0 flex items-start justify-between">
            Comments ({comments?.length ?? 0})
            <SheetClose>
              <Cross1Icon />
            </SheetClose>
          </SheetTitle>
        </SheetHeader>
        <Separator className="mt-3" />
        <div className="flex flex-col p-6">
          {comments?.length === 0 ? (
            <p className="font-light ">No comments yet</p>
          ) : (
            comments?.map((comment) => (
              <div key={comment.id} className="w-full">
                <div className="flex items-center mb-4 ">
                  <Image
                    src={comment.user?.avatar_url as string}
                    alt="Owner avatar"
                    width={30}
                    height={30}
                    className=" rounded-full mr-4"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="  font-light text-sm">
                      {comment.user?.login}
                    </p>
                    <p className="font-light text-slate-500 text-xs">
                      {dateTransform(comment.created_at as string)}
                    </p>
                  </div>
                </div>
                <Viewer body={comment.body}></Viewer>
                <Separator className="mb-6" />
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
