"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { tiptapExtensions } from "@/lib/tiptap-extensions";
import { uploadImage } from "@/lib/upload";

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`rounded-md px-2.5 py-1.5 text-sm font-medium ${
        active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

export function TiptapEditor({
  initialContent,
  onChange,
}: {
  initialContent?: JSONContent;
  onChange: (content: JSONContent) => void;
}) {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const editor = useEditor({
    extensions: tiptapExtensions,
    content: initialContent ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose-article max-w-none min-h-[280px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChangeRef.current(editor.getJSON()),
  });

  useEffect(() => {
    if (editor) onChangeRef.current(editor.getJSON());
  }, [editor]);

  async function handleInsertImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;
      const url = await uploadImage(file, "content");
      editor.chain().focus().setImage({ src: url }).run();
    };
    input.click();
  }

  function handleSetLink() {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL du lien", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  if (!editor) return null;

  return (
    <div className="rounded-md border border-card-border bg-card">
      <div className="flex flex-wrap gap-1 border-b border-card-border p-2">
        <ToolbarButton
          label="Gras"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          label="Italique"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          label="Titre 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          label="Titre 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          label="Liste à puces"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • Liste
        </ToolbarButton>
        <ToolbarButton
          label="Liste numérotée"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. Liste
        </ToolbarButton>
        <ToolbarButton
          label="Citation"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Citation
        </ToolbarButton>
        <ToolbarButton label="Lien" active={editor.isActive("link")} onClick={handleSetLink}>
          Lien
        </ToolbarButton>
        <ToolbarButton label="Image" onClick={handleInsertImage}>
          Image
        </ToolbarButton>
        <ToolbarButton label="Annuler" onClick={() => editor.chain().focus().undo().run()}>
          ↺
        </ToolbarButton>
        <ToolbarButton label="Rétablir" onClick={() => editor.chain().focus().redo().run()}>
          ↻
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
