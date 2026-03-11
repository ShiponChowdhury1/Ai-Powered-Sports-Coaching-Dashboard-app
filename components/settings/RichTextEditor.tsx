"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Link2,
  Quote,
  Code,
  ImageIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Highlighter,
  ChevronDown,
  Baseline,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const TEXT_COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7",
  "#cccccc", "#d9d9d9", "#ffffff", "#ff0000", "#ff4500",
  "#ff9900", "#ffff00", "#00cc00", "#00cccc", "#4a86e8",
  "#0000ff", "#9900ff", "#ff00ff", "#e06666", "#f6b26b",
];

const HIGHLIGHT_COLORS = [
  "#ffff00", "#00ff00", "#00ffff", "#ff00ff", "#ff9900",
  "#ff6666", "#6666ff", "#cc66ff", "#ffd966", "#93c47d",
  "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0", "#ffe599",
  "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd",
];

export default function RichTextEditor({
  content,
  onChange,
  minHeight = "300px",
}: RichTextEditorProps) {
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [activeTextColor, setActiveTextColor] = useState("#000000");
  const [activeHighlightColor, setActiveHighlightColor] = useState("#ffff00");
  const textColorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      UnderlineExtension,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "rte-link",
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "rte-image",
        },
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rte-editor focus:outline-none p-4",
        style: `min-height: ${minHeight}`,
      },
    },
  });

  // Sync content when prop changes externally (e.g., API data loads)
  const isUpdatingRef = useRef(false);
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const currentHTML = editor.getHTML();
      if (content !== currentHTML) {
        isUpdatingRef.current = true;
        editor.commands.setContent(content || "");
        isUpdatingRef.current = false;
      }
    }
  }, [content, editor]);

  // Close color pickers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (textColorRef.current && !textColorRef.current.contains(e.target as Node)) {
        setShowTextColorPicker(false);
      }
      if (highlightRef.current && !highlightRef.current.contains(e.target as Node)) {
        setShowHighlightPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL:", previousUrl ?? "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleSetImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter image URL:");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const handleSetTextColor = (color: string) => {
    setActiveTextColor(color);
    editor?.chain().focus().setColor(color).run();
    setShowTextColorPicker(false);
  };

  const handleSetHighlight = (color: string) => {
    setActiveHighlightColor(color);
    editor?.chain().focus().setHighlight({ color }).run();
    setShowHighlightPicker(false);
  };

  if (!editor) return null;

  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 flex flex-wrap items-center gap-0.5">

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Insert */}
        <ToolbarButton
          onClick={handleSetLink}
          isActive={editor.isActive("link")}
          title="Insert Link"
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={handleSetImage}
          isActive={false}
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Text Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>

        <Divider />

        {/* Text Color */}
        <div ref={textColorRef} className="relative">
          <button
            type="button"
            title="Text Color"
            onClick={() => {
              setShowTextColorPicker((v) => !v);
              setShowHighlightPicker(false);
            }}
            className="flex items-center gap-0.5 px-1.5 py-1.5 rounded text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <div className="flex flex-col items-center gap-0.5">
              <Baseline className="h-4 w-4" />
              <div
                className="h-[3px] w-4 rounded-sm"
                style={{ backgroundColor: activeTextColor }}
              />
            </div>
            <ChevronDown className="h-3 w-3 ml-0.5" />
          </button>
          {showTextColorPicker && (
            <ColorPickerDropdown
              title="Text Color"
              colors={TEXT_COLORS}
              onSelect={handleSetTextColor}
              onClear={() => {
                editor.chain().focus().unsetColor().run();
                setShowTextColorPicker(false);
              }}
            />
          )}
        </div>

        {/* Highlight Color */}
        <div ref={highlightRef} className="relative">
          <button
            type="button"
            title="Highlight Color"
            onClick={() => {
              setShowHighlightPicker((v) => !v);
              setShowTextColorPicker(false);
            }}
            className="flex items-center gap-0.5 px-1.5 py-1.5 rounded text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <div className="flex flex-col items-center gap-0.5">
              <Highlighter className="h-4 w-4" />
              <div
                className="h-[3px] w-4 rounded-sm"
                style={{ backgroundColor: activeHighlightColor }}
              />
            </div>
            <ChevronDown className="h-3 w-3 ml-0.5" />
          </button>
          {showHighlightPicker && (
            <ColorPickerDropdown
              title="Highlight Color"
              colors={HIGHLIGHT_COLORS}
              onSelect={handleSetHighlight}
              onClear={() => {
                editor.chain().focus().unsetHighlight().run();
                setShowHighlightPicker(false);
              }}
            />
          )}
        </div>

        <Divider />

        {/* Undo / Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          isActive={false}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          isActive={false}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}

// ─── Helper Sub-components ────────────────────────────────────────────────────

function Divider() {
  return <div className="w-px h-5 bg-gray-300 mx-1 self-center shrink-0" />;
}

function ToolbarButton({
  onClick,
  isActive = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        isActive
          ? "bg-emerald-100 text-emerald-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}

function ColorPickerDropdown({
  title,
  colors,
  onSelect,
  onClear,
}: {
  title: string;
  colors: string[];
  onSelect: (color: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2.5 w-[148px]">
      <p className="text-xs font-medium text-gray-500 mb-2">{title}</p>
      <div className="grid grid-cols-5 gap-1">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            onClick={() => onSelect(color)}
            className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform cursor-pointer"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onClear}
        className="mt-2 w-full text-center text-xs text-gray-500 hover:text-gray-700 py-1 hover:bg-gray-50 rounded transition-colors"
      >
        Clear
      </button>
    </div>
  );
}
