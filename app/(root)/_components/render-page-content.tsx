"use client";

import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import { type JSONContent } from "@tiptap/react";
import { generateHTML } from "@tiptap/react";
import React, { useMemo } from "react";
import parse from "html-react-parser";

const RenderPageContent = ({ json }: { json: JSONContent }) => {
  const output = useMemo(() => {
    return generateHTML(json, [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ]);
  }, [json]);
  return (
    <div className="w-full m-2 flex items-center justify-center">
      <div className="!w-full !max-w-none p-4 prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert prose-li:marker:text-primary">
        {parse(output)}
      </div>
    </div>
  );
};

export default RenderPageContent;
