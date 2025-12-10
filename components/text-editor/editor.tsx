"use client";

import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Menubar } from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { ResizableImage } from "tiptap-extension-resizable-image";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node";
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export function TextEditor({
  field,
  className,
  contentType = "json",
}: {
  field: any;
  className?: string;
  contentType?: "html" | "json" | "text";
}) {
  const lastSetByEditor = useRef<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({ openOnClick: false }),
      Image.configure({
        allowBase64: true,
        inline: true,
        resize: {
          enabled: true,
          directions: ["top", "bottom", "left", "right"],
          minWidth: 50,
          minHeight: 50,
          alwaysPreserveAspectRatio: true,
        },
      }),
      ResizableImage.configure({
        defaultWidth: 200,
        defaultHeight: 200,
      }),
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],

    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },

    onUpdate: ({ editor }) => {
      const value =
        contentType === "json"
          ? JSON.stringify(editor.getJSON())
          : contentType === "html"
            ? editor.getHTML()
            : editor.getText();

      lastSetByEditor.current = value;
      field.onChange(value);
    },
  });

  useEffect(() => {
    if (!editor) return;
    try {
      const parsed =
        contentType === "json" ? JSON.parse(field.value) : field.value;
      const serialized =
        contentType === "json"
          ? String(field.value ?? "")
          : String(field.value ?? "");

      if (serialized && lastSetByEditor.current === serialized) return;

      setTimeout(() => {
        if (!editor.isDestroyed) editor.commands.setContent(parsed);
      }, 0);
    } catch {
      const serialized = String(field.value ?? "");
      if (serialized && lastSetByEditor.current === serialized) return;

      setTimeout(() => {
        if (!editor.isDestroyed) editor.commands.setContent(field.value);
      }, 0);
    }
  }, [editor, field.value]);

  return (
    <div
      className={cn(
        "w-full border border-input overflow-hidden dark:bg-input/30",
        className
      )}
    >
      <EditorContext.Provider value={{ editor }}>
        <Menubar editor={editor} />
        <EditorContent editor={editor} role="presentation" />
      </EditorContext.Provider>
    </div>
  );
}
