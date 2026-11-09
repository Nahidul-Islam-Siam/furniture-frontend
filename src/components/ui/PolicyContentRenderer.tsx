"use client";

import React from "react";

export const renderMarkdownToHtml = (markdownText: string) => {
  if (!markdownText) return "";

  let html = markdownText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headings
  html = html.replace(
    /^### (.*$)/gim,
    '<h3 class="text-lg font-bold text-neutral-900 mt-6 mb-2.5">$1</h3>'
  );
  html = html.replace(
    /^## (.*$)/gim,
    '<h2 class="text-xl sm:text-2xl font-bold text-neutral-900 mt-8 mb-3.5 pb-2 border-b border-neutral-100">$1</h2>'
  );
  html = html.replace(
    /^# (.*$)/gim,
    '<h1 class="text-2xl sm:text-3xl font-black text-neutral-900 mt-10 mb-4">$1</h1>'
  );

  // Bold & Italic & Strike
  html = html.replace(
    /\*\*(.*?)\*\*/gim,
    '<strong class="font-bold text-neutral-900">$1</strong>'
  );
  html = html.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');
  html = html.replace(
    /~~(.*?)~~/gim,
    '<del class="line-through text-neutral-400">$1</del>'
  );
  html = html.replace(
    /__(.*?)__/gim,
    '<u class="underline decoration-neutral-400">$1</u>'
  );

  // Blockquotes
  html = html.replace(
    /^\> (.*$)/gim,
    '<blockquote class="border-l-4 border-[#e07548] bg-neutral-50 pl-4 py-2 my-4 text-neutral-700 italic rounded-r-lg">$1</blockquote>'
  );

  // Bullet & numbered lists
  html = html.replace(
    /^\s*-\s+(.*$)/gim,
    '<li class="list-disc ml-6 my-1">$1</li>'
  );
  html = html.replace(
    /^\s*\*\s+(.*$)/gim,
    '<li class="list-disc ml-6 my-1">$1</li>'
  );
  html = html.replace(
    /^\s*\d+\.\s+(.*$)/gim,
    '<li class="list-decimal ml-6 my-1">$1</li>'
  );

  // Paragraphs
  html = html.replace(/\n{2,}/g, '</p><p class="my-3 leading-relaxed text-neutral-700">');
  return `<p class="my-2 leading-relaxed text-neutral-700">${html}</p>`;
};

interface PolicyRendererProps {
  content: string;
}

export const PolicyContentRenderer: React.FC<PolicyRendererProps> = ({ content }) => {
  return (
    <div
      className="prose prose-neutral max-w-none text-sm sm:text-base leading-relaxed text-neutral-700"
      dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(content) }}
    />
  );
};

