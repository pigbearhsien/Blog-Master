"use client";

import { useEffect } from "react";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import "@/styles/block-note.css";

export default function Viewer({ body }: { body: string | undefined }) {
  const editor = useCreateBlockNote({
    domAttributes: {
      inlineContent: {
        // Adds a class to all `inlineContent` elements.
        class: "inline-content-css",
      },
    },
  });

  // For initialization; on mount, convert the initial Markdown to blocks and replace the default editor's content
  useEffect(() => {
    async function loadInitialHTML() {
      const blocks = await editor.tryParseMarkdownToBlocks(body as string);
      editor.replaceBlocks(editor.document, blocks);
    }
    loadInitialHTML();
  }, [editor, body]);

  return (
    <BlockNoteView editor={editor} editable={false} data-theming-css-demo />
  );
}
