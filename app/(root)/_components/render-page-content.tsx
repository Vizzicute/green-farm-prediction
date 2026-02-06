"use client";

import { type JSONContent } from "@tiptap/react";
import parse from "html-react-parser";
import { useJSONToHTML } from "@/hooks/use-json-to-html";

const RenderPageContent = ({ json }: { json: JSONContent }) => {
  const output = useJSONToHTML(json);
  return (
    <div className="w-full m-2 flex items-center justify-center">
      <div className="!w-full !max-w-none p-4 prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert prose-li:marker:text-primary">
        {parse(output)}
      </div>
    </div>
  );
};

export default RenderPageContent;
