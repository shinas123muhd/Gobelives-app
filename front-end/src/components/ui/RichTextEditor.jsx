"use client";
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaCode,
  FaLink,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaUndo,
  FaRedo,
} from "react-icons/fa";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="border border-gray-300 border-b-0 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1">
      {/* Headings */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-sm font-medium ${
          editor.isActive("heading", { level: 1 })
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700"
        }`}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-sm font-medium ${
          editor.isActive("heading", { level: 2 })
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700"
        }`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-sm font-medium ${
          editor.isActive("heading", { level: 3 })
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700"
        }`}
      >
        H3
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Text formatting */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive("bold")
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700"
        }`}
        title="Bold"
      >
        <FaBold size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive("italic")
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700"
        }`}
        title="Italic"
      >
        <FaItalic size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive("strike")
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700"
        }`}
        title="Strikethrough"
      >
        <FaStrikethrough size={14} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive("bulletList")
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700"
        }`}
        title="Bullet List"
      >
        <FaListUl size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive("orderedList")
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700"
        }`}
        title="Ordered List"
      >
        <FaListOl size={14} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Block elements */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive("blockquote")
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700"
        }`}
        title="Blockquote"
      >
        <FaQuoteLeft size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive("codeBlock")
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700"
        }`}
        title="Code Block"
      >
        <FaCode size={14} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Link */}
      <button
        type="button"
        onClick={addLink}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive("link")
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700"
        }`}
        title="Add Link"
      >
        <FaLink size={14} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Alignment */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive({ textAlign: "left" })
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700"
        }`}
        title="Align Left"
      >
        <FaAlignLeft size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive({ textAlign: "center" })
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700"
        }`}
        title="Align Center"
      >
        <FaAlignCenter size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive({ textAlign: "right" })
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700"
        }`}
        title="Align Right"
      >
        <FaAlignRight size={14} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Undo/Redo */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Undo"
      >
        <FaUndo size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Redo"
      >
        <FaRedo size={14} />
      </button>
    </div>
  );
};

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  error = false,
  className = "",
  height = "200px",
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none ${
          error ? "border-red-300" : ""
        }`,
      },
    },
  });

  // Update editor content when value changes externally
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  return (
    <div className={`rich-text-editor ${className}`}>
      <MenuBar editor={editor} />
      <div
        className={`border border-gray-300 rounded-b-lg ${
          error ? "border-red-300" : ""
        }`}
        style={{ minHeight: height }}
      >
        <EditorContent
          editor={editor}
          className="px-3 py-2"
          style={{ minHeight: height }}
          placeholder={placeholder}
        />
      </div>

      <style jsx global>{`
        .ProseMirror {
          min-height: ${height};
          padding: 12px;
        }

        .ProseMirror:focus {
          outline: none;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }

        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.5em 0;
        }

        .ProseMirror ul {
          list-style-type: disc;
        }

        .ProseMirror ol {
          list-style-type: decimal;
        }

        .ProseMirror li {
          margin: 0.25em 0;
        }

        .ProseMirror blockquote {
          border-left: 3px solid #d1d5db;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #6b7280;
        }

        .ProseMirror pre {
          background: #1f2937;
          color: #f3f4f6;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .ProseMirror code {
          background: #f3f4f6;
          color: #ef4444;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }

        .ProseMirror pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }

        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .ProseMirror a:hover {
          color: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
