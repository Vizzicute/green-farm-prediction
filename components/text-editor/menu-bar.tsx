"use client";

import { type Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Italic,
  ListIcon,
  ListOrdered,
  Redo,
  Strikethrough,
  Underline,
  Undo,
} from "lucide-react";
import { Toggle } from "../ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ImageUploadButton } from "../tiptap-ui/image-upload-button";
import { LinkPopover } from "../tiptap-ui/link-popover";

interface iComProps {
  editor: Editor | null;
}

export function Menubar({ editor }: iComProps) {
  if (!editor) return null;

  const editorButtons = [
    {
      icon: Bold,
      name: "Bold",
      pressed: editor.isActive("bold"),
      onPressedChange: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: Underline,
      name: "Underline",
      pressed: editor.isActive("underline"),
      onPressedChange: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      icon: Italic,
      name: "Italic",
      pressed: editor.isActive("italic"),
      onPressedChange: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: Strikethrough,
      name: "Strike",
      pressed: editor.isActive("strike"),
      onPressedChange: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      icon: Heading1Icon,
      name: "Heading 1",
      pressed: editor.isActive("heading", { level: 1 }),
      onPressedChange: () =>
        editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: Heading2Icon,
      name: "Heading 2",
      pressed: editor.isActive("heading", { level: 2 }),
      onPressedChange: () =>
        editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: Heading3Icon,
      name: "Heading 3",
      pressed: editor.isActive("heading", { level: 3 }),
      onPressedChange: () =>
        editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      icon: ListIcon,
      name: "Bullet List",
      pressed: editor.isActive("bulletList"),
      onPressedChange: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      name: "Order List",
      pressed: editor.isActive("orderedList"),
      onPressedChange: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: AlignLeft,
      name: "Align Left",
      pressed: editor.isActive({ textAlign: "left" }),
      onPressedChange: () => editor.chain().focus().setTextAlign("left").run(),
    },
    {
      icon: AlignCenter,
      name: "Align Center",
      pressed: editor.isActive({ textAlign: "center" }),
      onPressedChange: () =>
        editor.chain().focus().setTextAlign("center").run(),
    },
    {
      icon: AlignRight,
      name: "Align Right",
      pressed: editor.isActive({ textAlign: "right" }),
      onPressedChange: () => editor.chain().focus().setTextAlign("right").run(),
    },
  ];

  const actionButton = [
    {
      icon: Undo,
      name: "Undo",
      onClick: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
    },
    {
      icon: Redo,
      name: "Redo",
      onClick: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
    },
  ];

  return (
    <div className="border border-t-0 border-x-0 border-input bg-card flex">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1">
          {actionButton.map((param, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size={"sm"}
                  variant={"ghost"}
                  onClick={param.onClick}
                  disabled={param.disabled}
                >
                  <param.icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{param.name}</TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="w-px h-6 bg-border mx-2 self-center" />
        <div className="flex flex-wrap gap-1">
          {editorButtons
            .filter(
              (param) =>
                param.name === "Bold" ||
                param.name === "Italic" ||
                param.name === "Underline" ||
                param.name === "Strike" ||
                param.name === "Heading 1" ||
                param.name === "Heading 2" ||
                param.name === "Heading 3" ||
                param.name === "Bullet List" ||
                param.name === "Order List"
            )
            .map((param, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Toggle
                    size={"sm"}
                    pressed={param.pressed}
                    onPressedChange={param.onPressedChange}
                    className={cn(
                      param.pressed && "bg-muted text-muted-foreground"
                    )}
                  >
                    <param.icon />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>{param.name}</TooltipContent>
              </Tooltip>
            ))}
        </div>
        <div className="w-px h-6 bg-border mx-2 self-center" />
        <div className="flex flex-wrap gap-1">
          {editorButtons
            .filter(
              (param) =>
                param.name === "Align Left" ||
                param.name === "Align Center" ||
                param.name === "Align Right"
            )
            .map((param, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Toggle
                    size={"sm"}
                    pressed={param.pressed}
                    onPressedChange={param.onPressedChange}
                    className={cn(
                      param.pressed && "bg-muted text-muted-foreground"
                    )}
                  >
                    <param.icon />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>{param.name}</TooltipContent>
              </Tooltip>
            ))}
        </div>
        <div className="w-px h-6 bg-border mx-2 self-center" />
        <LinkPopover autoOpenOnLinkActive={true} />
        <ImageUploadButton />
      </TooltipProvider>
    </div>
  );
}
