"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
// import "@mantine/core/styles.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { createIssue, updateIssue } from "@/lib/github-api";
import "./styles/Viewer.css";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

type EditorProps = {
  initialTitle: string | undefined;
  initialBody: string | undefined;
  number: number | undefined;
};

export default function Editor({
  initialTitle,
  initialBody,
  number,
}: EditorProps) {
  const editor = useCreateBlockNote();

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRepo = searchParams.get("repo") as string;
  const [title, setTitle] = useState<string | undefined>(initialTitle);

  // For initialization; on mount, convert the initial Markdown to blocks and replace the default editor's content
  useEffect(() => {
    async function loadInitialHTML() {
      const blocks = await editor.tryParseMarkdownToBlocks(
        initialBody as string
      );
      editor.replaceBlocks(editor.document, blocks);
    }
    loadInitialHTML();
  }, [editor, initialBody]);

  const handleCreateIssue = async () => {
    const markdownBody = await editor.blocksToMarkdownLossy(editor.document);
    if (markdownBody.length < 30) {
      toast.error("Please enter at least 30 characters");
      return;
    }
    if (!title) {
      toast.error("Please enter a title");
      return;
    }
    const { newIssue, createIssueError } = await createIssue(
      {
        owner: session?.user?.name as string,
        repo: currentRepo,
        title,
        body: markdownBody,
      },
      session?.user.accessToken as string
    );

    if (createIssueError) {
      toast.error(createIssueError);
      return;
    }

    toast.success("Issue created");
    router.push(
      `/${session?.user?.name}/issue/${newIssue.number}?repo=${currentRepo}`
    );
    router.refresh();
  };

  const handleUpdateIssue = async () => {
    const markdownBody = await editor.blocksToMarkdownLossy(editor.document);
    if (markdownBody.length < 30) {
      toast.error("Please enter at least 30 characters");
      return;
    }
    if (!title) {
      toast.error("Please enter a title");
      return;
    }
    const { updateIssueError } = await updateIssue(
      {
        owner: session?.user?.name as string,
        repo: currentRepo,
        number: number as number,
        title,
        body: markdownBody,
      },
      session?.user.accessToken as string
    );

    if (updateIssueError) {
      toast.error(updateIssueError);
      return;
    }

    toast.success("Issue updated");
    router.push(`/${session?.user?.name}/issue/${number}?repo=${currentRepo}`);
    router.refresh();
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (number) {
            handleUpdateIssue();
          } else {
            handleCreateIssue();
          }
        }}
        className=" "
      >
        <div className="w-fit ml-auto">
          <Button type="submit" className="bg-[#1A8917] hover:bg-[#1A8917]/90">
            Save
          </Button>
          <Button
            type="button"
            className="ml-4"
            variant={"outline"}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
        <div>
          <Label htmlFor="Title">Title</Label>
          <Textarea
            id="Title"
            aria-multiline
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="h-auto my-4 text-4xl font-bold !outline-none !border-none !ring-0 shadow-none px-0"
          />
        </div>
      </form>
      <Separator className="my-4" />
      <BlockNoteView editor={editor} data-theming-css-demo />
    </>
  );
}
