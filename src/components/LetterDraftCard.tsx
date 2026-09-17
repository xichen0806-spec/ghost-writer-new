import React, { useState } from "react";
import { Copy, Check, Heart, PhoneCall, Printer, Download, Sparkles, Feather, FileCode } from "lucide-react";
import { generateLetterHtml } from "../utils/exportHtml";

interface LetterDraftCardProps {
  content: string;
}

export const LetterDraftCard: React.FC<LetterDraftCardProps> = ({ content }) => {
  const [selectedOption, setSelectedOption] = useState<"A" | "B">("A");
  const [copied, setCopied] = useState(false);

  // Parse drafts out of content if available
  const cleanContent = content.replace(/\*\*/g, "").replace(/\*/g, "");
  const optionAParts = cleanContent.split("### Option B:");
  const optionAText = optionAParts[0]?.replace(/### Option A:.*?\n/, "").trim() || "";
  const optionBText = optionAParts[1]?.trim() || "";

  const activeLetterText = (selectedOption === "A" ? optionAText : optionBText || cleanContent)
    .replace(/\*\*/g, "")
    .replace(/\*/g, "");

  const wordCount = activeLetterText.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 130));

  const handleCopy = () => {
    navigator.clipboard.writeText(activeLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([activeLetterText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Letter-to-Dad-${selectedOption === "A" ? "Option-A-Intimate" : "Option-B-Direct"}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const htmlString = generateLetterHtml({
      title: "Letter to Dad",
      letterContent: activeLetterText,
      optionName: selectedOption === "A" ? "Option I: Intimate & Gentle" : "Option II: Direct & Sincere",
      dateStr: currentDate,
      wordCount,
    });
    const blob = new Blob([htmlString], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Letter-to-Dad-${selectedOption === "A" ? "Option-A-Intimate" : "Option-B-Direct"}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-5 rounded-2xl bg-white border border-stone-200/90 shadow-[0_4px_24px_-4px_rgba(28,25,23,0.06)] overflow-hidden transition-all">
      {/* Stationery Header Bar */}
      <div className="px-6 py-4 bg-gradient-to-r from-stone-50 via-[#FAF8F5] to-stone-50 border-b border-stone-200/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs">
            <Feather className="w-3.5 h-3.5 text-amber-200" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500 font-sans-ui">
              Correspondence Draft
            </span>
            <h4 className="text-sm font-semibold text-stone-900 font-editorial">
              Your Letter to Your Dad
            </h4>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {optionBText && (
            <div className="bg-stone-200/60 p-0.5 rounded-lg flex text-xs font-medium font-sans-ui">
              <button
                onClick={() => setSelectedOption("A")}
                className={`px-3 py-1 rounded-md transition-all ${
                  selectedOption === "A"
                    ? "bg-white text-stone-900 shadow-2xs font-semibold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Option I: Intimate
              </button>
              <button
                onClick={() => setSelectedOption("B")}
                className={`px-3 py-1 rounded-md transition-all ${
                  selectedOption === "B"
                    ? "bg-white text-stone-900 shadow-2xs font-semibold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Option II: Direct
              </button>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg flex items-center space-x-1.5 shadow-2xs transition-colors"
            title="Copy letter to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handleDownloadHtml}
            className="px-2.5 py-1.5 text-xs font-semibold bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-lg flex items-center space-x-1 shadow-2xs transition-colors"
            title="Download formatted HTML document"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-200" />
            <span>HTML</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            title="Download plain text file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            title="Print letter or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Parchment Body */}
      <div className="p-8 sm:p-10 bg-[#FAF9F6] relative">
        {/* Subtle Watermark Ornament */}
        <div className="absolute right-8 top-8 opacity-5 pointer-events-none select-none">
          <Heart className="w-28 h-28 text-stone-900" />
        </div>

        {/* Letter Text */}
        <div className="font-editorial text-[15px] sm:text-[16px] text-stone-800 leading-[1.8] whitespace-pre-wrap selection:bg-amber-100/70">
          {activeLetterText}
        </div>

        {/* Card Footer */}
        <div className="mt-8 pt-4 border-t border-stone-200/60 flex flex-wrap items-center justify-between text-xs text-stone-500 font-sans-ui gap-2">
          <div className="flex items-center space-x-1.5 text-stone-700">
            <PhoneCall className="w-3.5 h-3.5 text-amber-800" />
            <span>Recommended for reading before your phone call</span>
          </div>

          <div className="text-[11px] text-stone-400">
            {wordCount} words · ~{readTime} min read
          </div>
        </div>
      </div>
    </div>
  );
};
