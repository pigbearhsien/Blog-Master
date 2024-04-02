"use client";

import { ChangeEvent, useCallback, useEffect } from "react";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";

export default function Viewer({ body }: { body: string | undefined }) {
  // Creates a new editor instance.
  const editor = useCreateBlockNote();

  // For initialization; on mount, convert the initial Markdown to blocks and replace the default editor's content
  useEffect(() => {
    async function loadInitialHTML() {
      const blocks = await editor.tryParseMarkdownToBlocks(body as string);
      editor.replaceBlocks(editor.document, blocks);
    }
    loadInitialHTML();
  }, [editor, body]);

  // Renders the editor instance using a React component.
  return <BlockNoteView editor={editor} editable={false} />;
}
