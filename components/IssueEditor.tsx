"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import "@mantine/core/styles.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { createIssue, updateIssue } from "@/lib/github-api";

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
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRepo = searchParams.get("repo") as string;
  const editor = useCreateBlockNote();
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

  const checkCharacter = () => {
    let word = "";
    editor.document.forEach((block) => {
      block.content?.forEach((content) => {
        word += content.text;
      });
    });
    if (word.length < 30) {
      return false;
    } else {
      return true;
    }
  };

  const handleCreateIssue = async () => {
    const ok = checkCharacter();
    if (!ok) {
      toast.error("Please enter at least 30 characters");
      return;
    }

    const markdownBody = await editor.blocksToMarkdownLossy(editor.document);
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
  };

  const handleUpdateIssue = async () => {
    const ok = checkCharacter();
    if (!ok) {
      toast.error("Please enter at least 30 characters");
      return;
    }

    const markdownBody = await editor.blocksToMarkdownLossy(editor.document);
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
        className="flex w-full items-center"
      >
        Title:
        <Input
          type="text"
          className="w-1/2 mr-auto ml-2"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {/* Since the button is of type "submit", clicking it or pressing Enter will submit the form */}
        <Button type="submit">Save</Button>
      </form>
      <br />
      <BlockNoteView editor={editor} />
    </>
  );
}
