"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useRef } from "react";

interface TiptapEditorProps {
  content: string;
  onUpdate: (html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({
  content,
  onUpdate,
  placeholder = "Add a description...",
}: TiptapEditorProps) {
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { class: "text-primary underline" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none text-text focus:outline-none min-h-[80px] px-3 py-2",
      },
    },
    onBlur({ editor: e }) {
      onUpdateRef.current(e.getHTML());
    },
  });

  // Sync content from outside (e.g. when switching issues)
  useEffect(() => {
    if (editor && !editor.isFocused) {
      const current = editor.getHTML();
      // Only update if content actually changed (avoid cursor reset)
      if (current !== content && !(current === "<p></p>" && !content)) {
        editor.commands.setContent(content || "");
      }
    }
  }, [content, editor]);

  const toggleBold = useCallback(() => editor?.chain().focus().toggleBold().run(), [editor]);
  const toggleItalic = useCallback(() => editor?.chain().focus().toggleItalic().run(), [editor]);
  const toggleCode = useCallback(() => editor?.chain().focus().toggleCode().run(), [editor]);
  const toggleBulletList = useCallback(() => editor?.chain().focus().toggleBulletList().run(), [editor]);
  const toggleOrderedList = useCallback(() => editor?.chain().focus().toggleOrderedList().run(), [editor]);
  const toggleHeading = useCallback(
    () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
    [editor]
  );
  const toggleBlockquote = useCallback(() => editor?.chain().focus().toggleBlockquote().run(), [editor]);

  if (!editor) return null;

  return (
    <div className="tiptap rounded-lg border border-border bg-surface transition-colors focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-border-strong">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border">
        <ToolbarButton
          onClick={toggleHeading}
          active={editor.isActive("heading", { level: 3 })}
          label="Heading"
        >
          H
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleBold}
          active={editor.isActive("bold")}
          label="Bold"
        >
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleItalic}
          active={editor.isActive("italic")}
          label="Italic"
        >
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleCode}
          active={editor.isActive("code")}
          label="Code"
        >
          <span className="font-mono text-[10px]">&lt;/&gt;</span>
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton
          onClick={toggleBulletList}
          active={editor.isActive("bulletList")}
          label="Bullet list"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="3" cy="4" r="1.5" />
            <circle cx="3" cy="8" r="1.5" />
            <circle cx="3" cy="12" r="1.5" />
            <rect x="6" y="3" width="9" height="2" rx="0.5" />
            <rect x="6" y="7" width="9" height="2" rx="0.5" />
            <rect x="6" y="11" width="9" height="2" rx="0.5" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleOrderedList}
          active={editor.isActive("orderedList")}
          label="Numbered list"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <text x="1" y="6" fontSize="6" fontFamily="monospace">1</text>
            <text x="1" y="10" fontSize="6" fontFamily="monospace">2</text>
            <text x="1" y="14" fontSize="6" fontFamily="monospace">3</text>
            <rect x="6" y="3" width="9" height="2" rx="0.5" />
            <rect x="6" y="7" width="9" height="2" rx="0.5" />
            <rect x="6" y="11" width="9" height="2" rx="0.5" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleBlockquote}
          active={editor.isActive("blockquote")}
          label="Quote"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <rect x="2" y="2" width="2" height="12" rx="1" />
            <rect x="6" y="4" width="8" height="2" rx="0.5" />
            <rect x="6" y="8" width="6" height="2" rx="0.5" />
          </svg>
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`flex items-center justify-center w-7 h-7 rounded text-xs transition-colors ${
        active
          ? "bg-surface-hover text-text"
          : "text-text-muted hover:bg-surface-hover hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}
