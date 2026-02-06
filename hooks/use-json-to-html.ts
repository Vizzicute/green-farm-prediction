import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import { type JSONContent } from "@tiptap/react";
import { generateHTML } from "@tiptap/react";
import { useMemo } from "react";
import Image from "@tiptap/extension-image";

export function useJSONToHTML(json: JSONContent | null | undefined) {
  const output = useMemo(() => {
    // If json is missing or not an object, return empty string (or fallback HTML)
    if (!json || typeof json !== "object") {
      return "";
      // Or: return "<p></p>"
    }

    try {
      return generateHTML(json, [
        StarterKit,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Image,
      ]);
    } catch (error) {
      console.error("Failed to generate HTML from JSON:", error);
      return "";
      // You can also return an error message if desired
      // return "<p>Invalid content</p>";
    }
  }, [json]);

  return output;
}

export const safeParseTiptapJSON = (value: string | object | null | undefined) => {
  try {
    // If it's already parsed (object), return it
    if (value && typeof value === "object") return value;

    // If it's a JSON string, parse
    if (typeof value === "string" && value.trim().length > 0) {
      return JSON.parse(value);
    }
  } catch (e) {
    console.warn("Invalid Tiptap JSON:", e);
  }

  // Fallback to a valid empty Tiptap document
  return {
    type: "doc",
    content: [{ type: "paragraph" }],
  };
};