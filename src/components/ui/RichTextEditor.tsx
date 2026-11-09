"use client";

import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Eye,
  Edit3,
  Undo2,
  Redo2,
  Table as TableIcon,
  Sparkles,
} from "lucide-react";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Write comprehensive product specifications, ergonomic benefits, warranty notes...",
  minHeight = 220,
}) => {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Apply formatting to selection
  const applyFormat = (prefix: string, suffix: string = prefix, defaultText = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;

    const newValue =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);

    onChange?.(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length
      );
    }, 0);
  };

  const insertBlock = (prefix: string, defaultText = "Heading") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end) || defaultText;
    const replacement = `\n${prefix} ${selected}\n`;

    const newValue =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);

    onChange?.(newValue);
    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  const insertTable = () => {
    const tableTemplate = `\n| Feature | Specification |\n| :--- | :--- |\n| Material | Solid Wood / High Density Mesh |\n| Warranty | 5 Years Limited Warranty |\n| Assembly | Free Professional Assembly in Dhaka |\n`;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newValue =
      textarea.value.substring(0, start) +
      tableTemplate +
      textarea.value.substring(start);

    onChange?.(newValue);
  };

  // Convert simple markdown to safe HTML for preview
  const renderPreviewHtml = (markdownText: string) => {
    if (!markdownText.trim()) {
      return `<p class="text-neutral-400 italic">No description provided yet.</p>`;
    }

    let html = markdownText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-neutral-900 mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-extrabold text-neutral-900 mt-5 mb-2.5 pb-1 border-b border-neutral-100">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black text-neutral-900 mt-6 mb-3">$1</h1>');

    // Bold, Italic, Strikethrough
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-neutral-900">$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');
    html = html.replace(/~~(.*?)~~/gim, '<del class="line-through text-neutral-400">$1</del>');
    html = html.replace(/__(.*?)__/gim, '<u class="underline decoration-neutral-400">$1</u>');

    // Blockquote
    html = html.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-[#e07548] pl-3 py-1 my-2 bg-neutral-50 text-neutral-700 italic">$1</blockquote>');

    // Bullet points
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="list-disc ml-5 my-0.5">$1</li>');
    html = html.replace(/^\s*\*\s+(.*$)/gim, '<li class="list-disc ml-5 my-0.5">$1</li>');

    // Ordered list
    html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="list-decimal ml-5 my-0.5">$1</li>');

    // Line breaks into paragraphs
    html = html.replace(/\n{2,}/g, '</p><p class="my-2.5">');
    html = `<p class="my-1.5">${html}</p>`;

    return html;
  };

  return (
    <div className="w-full border border-neutral-300 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
      {/* Editor Header & Toolbar */}
      <div className="bg-neutral-50 border-b border-neutral-200 p-2 flex flex-wrap items-center justify-between gap-1.5 select-none">
        {/* Left Toolbar formatting buttons */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => applyFormat("**", "**", "Bold text")}
            title="Bold (Ctrl+B)"
            className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => applyFormat("*", "*", "Italic text")}
            title="Italic"
            className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => applyFormat("__", "__", "Underlined text")}
            title="Underline"
            className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            <Underline className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => applyFormat("~~", "~~", "Strikethrough text")}
            title="Strikethrough"
            className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-neutral-300 mx-1" />

          <button
            type="button"
            onClick={() => insertBlock("##", "Section Heading")}
            title="Heading 2"
            className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 font-bold text-xs flex items-center gap-0.5"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertBlock("###", "Sub-heading")}
            title="Heading 3"
            className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 font-bold text-xs flex items-center gap-0.5"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-neutral-300 mx-1" />

          <button
            type="button"
            onClick={() => insertBlock("-", "Feature highlight point")}
            title="Bullet List"
            className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertBlock("1.", "Step-by-step point")}
            title="Numbered List"
            className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertBlock(">", "Important quote or warranty highlight")}
            title="Blockquote"
            className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            <Quote className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={insertTable}
            title="Insert Specs Table"
            className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 flex items-center gap-1 text-xs font-medium"
          >
            <TableIcon className="w-4 h-4" /> Specs Table
          </button>
        </div>

        {/* Right Mode Toggle (Write vs Preview) */}
        <div className="flex items-center gap-1 bg-neutral-200/80 p-0.5 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === "write"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === "preview"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="relative">
        {activeTab === "write" ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            style={{ minHeight }}
            className="w-full p-4 font-sans text-sm text-neutral-900 outline-none resize-y border-0 leading-relaxed placeholder:text-neutral-400"
          />
        ) : (
          <div
            style={{ minHeight }}
            className="w-full p-4 font-sans text-sm text-neutral-800 leading-relaxed bg-neutral-50/50 overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: renderPreviewHtml(value) }}
          />
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="bg-neutral-50/80 border-t border-neutral-100 px-3 py-1.5 text-[11px] text-neutral-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#e07548]" /> Markdown & Rich Typography Supported
        </span>
        <span>
          {value.length} characters • {value.trim() ? value.trim().split(/\s+/).length : 0} words
        </span>
      </div>
    </div>
  );
};

export default RichTextEditor;

