"use client";

import { useTheme } from "next-themes";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core"
import { BlockNoteView, useBlockNote } from "@blocknote/react"
import { useEdgeStore } from "@/lib/edgestore";

import "@blocknote/core/style.css";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {

  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  /**
   * @desc 上传图片到edgestore，并返回图片地址
   * @param file File
   * @returns url
   */
  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file
    });

    return response.url;
  }

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
    onEditorContentChange: (editor) => {
      // 编辑器onChange事件
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    // 编辑器内上传图片
    uploadFile: handleUpload
  })

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === 'dark' ? "dark" : "light"}
      />
    </div>
  )
};

export default Editor;