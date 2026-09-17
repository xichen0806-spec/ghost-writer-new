import React, { useState } from "react";
import {
  Feather,
  Copy,
  Check,
  Printer,
  Download,
  PhoneCall,
  Heart,
  Sparkles,
  BookOpen,
  Calendar,
  Smile,
  ShieldCheck,
  Clock,
  Send,
  FileCode,
} from "lucide-react";
import { generateLetterHtml } from "../utils/exportHtml";

interface DesktopStationeryPanelProps {
  draftContent: string | null;
  gatekeeperStatus: {
    slot1: boolean;
    slot2: boolean;
    slot3: boolean;
    slot4: boolean;
    slot5: boolean;
    allFilled: boolean;
  };
}

export const DesktopStationeryPanel: React.FC<DesktopStationeryPanelProps> = ({
  draftContent,
  gatekeeperStatus,
}) => {
  const [selectedOption, setSelectedOption] = useState<"A" | "B">("A");
  const [copied, setCopied] = useState(false);

  // If we have a draft, parse options cleanly
  let activeLetterText = "";
  let optionBText = "";

  if (draftContent) {
    const cleanContent = draftContent.replace(/\*\*/g, "").replace(/\*/g, "");
    const optionAParts = cleanContent.split("### Option B:");
    const optionAText = optionAParts[0]?.replace(/### Option A:.*?\n/, "").trim() || "";
    optionBText = optionAParts[1]?.trim() || "";
    activeLetterText = selectedOption === "A" ? optionAText : optionBText || cleanContent;
    activeLetterText = activeLetterText.replace(/\*\*/g, "").replace(/\*/g, "");
  }

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
    link.download = `Letter-to-Dad-${selectedOption === "A" ? "Option-I-Intimate" : "Option-II-Direct"}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
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
    link.download = `Letter-to-Dad-${selectedOption === "A" ? "Option-I-Intimate" : "Option-II-Direct"}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="w-full h-full flex flex-col justify-start items-center overflow-y-auto p-6 sm:p-8 lg:p-10 xl:p-12">
      {draftContent ? (
        /* Complete Letter Render on Stationery Desk */
        <div className="w-full max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in">
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-[0_12px_40px_-8px_rgba(28,25,23,0.08)] overflow-hidden">
            {/* Stationery Top Bar */}
            <div className="px-8 py-5 bg-gradient-to-r from-stone-50 via-[#FAF8F5] to-stone-50 border-b border-stone-200/70 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs">
                  <Feather className="w-4 h-4 text-amber-200" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500 font-sans-ui">
                    Correspondence Ready
                  </span>
                  <h3 className="text-base font-bold text-stone-900 font-editorial">
                    Letter to Your Dad
                  </h3>
                </div>
              </div>

              {/* Actions & Tone Switcher */}
              <div className="flex items-center space-x-2.5">
                {optionBText && (
                  <div className="bg-stone-200/70 p-1 rounded-xl flex text-xs font-medium font-sans-ui">
                    <button
                      onClick={() => setSelectedOption("A")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        selectedOption === "A"
                          ? "bg-white text-stone-900 shadow-2xs font-semibold"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      Option I: Intimate
                    </button>
                    <button
                      onClick={() => setSelectedOption("B")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
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
                  className="px-3.5 py-1.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  onClick={handleDownloadHtml}
                  className="px-3 py-1.5 text-xs font-semibold bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors"
                  title="Download beautifully styled HTML letter"
                >
                  <FileCode className="w-3.5 h-3.5 text-amber-200" />
                  <span>Download HTML</span>
                </button>

                <button
                  onClick={handleDownloadTxt}
                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors border border-stone-200/60"
                  title="Download plain text (.txt)"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={handlePrint}
                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors border border-stone-200/60"
                  title="Print letter or Save as PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Letter Body Area */}
            <div className="p-8 sm:p-14 bg-[#FCFAF7] relative min-h-[460px]">
              <div className="absolute right-12 top-12 opacity-5 pointer-events-none select-none">
                <Heart className="w-44 h-44 text-stone-900" />
              </div>

              <div className="max-w-3xl font-editorial text-[16px] xl:text-[17.5px] text-stone-800 leading-[1.85] whitespace-pre-wrap selection:bg-amber-100/70">
                {activeLetterText}
              </div>

              <div className="mt-12 pt-6 border-t border-stone-200/60 flex flex-wrap items-center justify-between text-xs text-stone-500 font-sans-ui gap-3">
                <div className="flex items-center space-x-2 text-stone-700">
                  <PhoneCall className="w-4 h-4 text-amber-800" />
                  <span>Preparation note: Read through this draft once before your phone call</span>
                </div>
                <div className="text-[11px] text-stone-400 flex items-center gap-2">
                  <span>{wordCount} words</span>
                  <span>·</span>
                  <span>~{readTime} min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Supportive Call Preparation Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 border border-stone-200/80 rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center space-x-2.5 text-stone-900 mb-2">
                <PhoneCall className="w-4 h-4 text-amber-800" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-sans-ui">
                  Before You Call Him
                </h4>
              </div>
              <p className="text-xs text-stone-600 font-sans-ui leading-relaxed">
                Take a deep breath. You don't need to read this letter word-for-word on the phone. Having written it gives you emotional clarity so you won't become defensive if tensions arise.
              </p>
            </div>

            <div className="bg-white/80 border border-stone-200/80 rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center space-x-2.5 text-stone-900 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-sans-ui">
                  Guaranteed Sincerity
                </h4>
              </div>
              <p className="text-xs text-stone-600 font-sans-ui leading-relaxed">
                This letter contains solely your true gratitude, specific apology, and personal accountability. No generic clichés or superficial formulas were used.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Real App Stationery Preview & Sanctuary Environment (No Testing Checklists) */
        <div className="w-full max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-6">
          {/* Main Stationery Parchment */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-[0_10px_35px_-8px_rgba(28,25,23,0.06)] overflow-hidden">
            {/* Stationery Header */}
            <div className="px-8 py-5 bg-gradient-to-r from-stone-50 via-[#FAF8F5] to-stone-50 border-b border-stone-200/70 flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-stone-100 border border-stone-200 text-stone-800 flex items-center justify-center shadow-xs">
                  <Feather className="w-4 h-4 text-amber-800" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500 font-sans-ui">
                    Writing Desk
                  </span>
                  <h3 className="text-base font-bold text-stone-900 font-editorial">
                    Draft in Progress
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs font-sans-ui text-stone-500">
                <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                <span>Reflecting with Ghostwriter...</span>
              </div>
            </div>

            {/* Living Stationery Sheet with Realistic Formatting */}
            <div className="p-8 sm:p-14 bg-[#FCFAF7] min-h-[460px] flex flex-col justify-between relative">
              <div className="absolute right-12 top-12 opacity-5 pointer-events-none select-none">
                <Heart className="w-44 h-44 text-stone-900" />
              </div>

              <div className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between text-xs text-stone-400 font-sans-ui border-b border-stone-200/50 pb-3">
                  <span>To: Dad</span>
                  <span>{currentDate}</span>
                </div>

                <div className="space-y-4 font-editorial text-stone-700 text-[15px] sm:text-[16px] leading-[1.85]">
                  <p className="font-semibold text-stone-900 text-lg">
                    Dear Dad,
                  </p>

                  <p className="text-stone-500 italic bg-stone-100/40 p-4 rounded-2xl border border-stone-200/40">
                    As you answer each question on the left, the Ghostwriter will weave your true story, your apology, and your gratitude into a sincere letter right here.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="h-4 bg-stone-200/40 rounded-full w-11/12 animate-pulse" />
                    <div className="h-4 bg-stone-200/30 rounded-full w-full animate-pulse delay-75" />
                    <div className="h-4 bg-stone-200/40 rounded-full w-4/5 animate-pulse delay-150" />
                  </div>

                  <p className="text-stone-400 text-xs font-sans-ui pt-2">
                    Two thoughtful versions (Gentle & Intimate vs. Sincere & Direct) will appear once we gather your genuine perspective.
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-5 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-400 font-sans-ui">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Genuine apology &amp; heartfelt gratitude studio</span>
                </span>
                <span>Calm &amp; Private</span>
              </div>
            </div>
          </div>

          {/* Supportive Reflection Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/80 border border-stone-200/80 rounded-2xl p-4.5 shadow-2xs">
              <div className="flex items-center space-x-2 text-stone-900 mb-1.5">
                <Smile className="w-4 h-4 text-amber-800" />
                <h5 className="text-xs font-bold uppercase tracking-wider font-sans-ui">
                  Patience &amp; Space
                </h5>
              </div>
              <p className="text-xs text-stone-500 font-sans-ui leading-relaxed">
                Take as much time as you need. There is no rush—sharing your true feelings honestly is what brings real peace.
              </p>
            </div>

            <div className="bg-white/80 border border-stone-200/80 rounded-2xl p-4.5 shadow-2xs">
              <div className="flex items-center space-x-2 text-stone-900 mb-1.5">
                <Heart className="w-4 h-4 text-rose-800" />
                <h5 className="text-xs font-bold uppercase tracking-wider font-sans-ui">
                  Rooted in Gratitude
                </h5>
              </div>
              <p className="text-xs text-stone-500 font-sans-ui leading-relaxed">
                A meaningful apology acknowledges the hurt while reaffirming your deep appreciation for everything he has given you.
              </p>
            </div>

            <div className="bg-white/80 border border-stone-200/80 rounded-2xl p-4.5 shadow-2xs">
              <div className="flex items-center space-x-2 text-stone-900 mb-1.5">
                <PhoneCall className="w-4 h-4 text-stone-800" />
                <h5 className="text-xs font-bold uppercase tracking-wider font-sans-ui">
                  Phone Call Ready
                </h5>
              </div>
              <p className="text-xs text-stone-500 font-sans-ui leading-relaxed">
                Writing down your thoughts helps remove emotional fog, giving you clarity and confidence before hearing his voice.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
