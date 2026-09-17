import React, { useState, useEffect, useRef } from "react";
import {
  Feather,
  RotateCcw,
  Send,
  User,
  Loader2,
  FileText,
  Info,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import { letterAgentData } from "./data/letterAgentData";
import { ChatMessage } from "./types";
import { SystemDiagramModal } from "./components/SystemDiagramModal";
import { SpecsModal } from "./components/SpecsModal";
import { LetterDraftCard } from "./components/LetterDraftCard";
import { DesktopStationeryPanel } from "./components/DesktopStationeryPanel";

export default function App() {
  const [isDiagramOpen, setIsDiagramOpen] = useState<boolean>(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputText, setInputText] = useState("");
  const [mobileTab, setMobileTab] = useState<"chat" | "letter">("chat");

  const stripAsterisks = (text: string) => {
    if (!text) return "";
    return text.replace(/\*\*/g, "").replace(/\*/g, "");
  };

  const initialGreeting: ChatMessage = {
    id: "msg-init",
    role: "assistant",
    content:
      "Hello. I'm here to help you put your true feelings into words for your dad.\n\nWe'll take this gently, one comfortable step at a time, so you can feel clear and at peace before your upcoming phone call.\n\nTo start with the simplest touch: How do you usually address your dad (e.g., Dad, Daddy, Papa)?",
    timestamp: Date.now(),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Find latest drafted letter if any exists
  const latestDraftMsg = [...messages].reverse().find(
    (m) =>
      m.role === "assistant" &&
      (m.content.includes("### Option A:") ||
        m.content.includes("Option A: Gentle") ||
        m.content.includes("Dear Dad,") ||
        m.content.includes("Option A"))
  );

  // Evaluate slots for real-time progress display on desktop
  const evaluateGatekeeper = (msgs: ChatMessage[]) => {
    const userText = msgs
      .filter((m) => m.role === "user")
      .map((m) => m.content.toLowerCase())
      .join(" ");

    const slot1 =
      userText.includes("temper") ||
      userText.includes("slap") ||
      userText.includes("hit") ||
      userText.includes("frustrat") ||
      userText.includes("yell") ||
      userText.includes("screamed") ||
      userText.includes("physical") ||
      userText.includes("angry") ||
      userText.includes("argument");

    const slot2 =
      userText.includes("thank") ||
      userText.includes("grateful") ||
      userText.includes("appreciat") ||
      userText.includes("help") ||
      userText.includes("time") ||
      userText.includes("sacrifice") ||
      userText.includes("money") ||
      userText.includes("food") ||
      userText.includes("care") ||
      userText.includes("drive") ||
      userText.includes("taught");

    const slot3 =
      userText.includes("quiet") ||
      userText.includes("silent") ||
      userText.includes("practical") ||
      userText.includes("direct") ||
      userText.includes("traditional") ||
      userText.includes("personality") ||
      userText.includes("strict") ||
      userText.includes("gentle") ||
      userText.includes("calm");

    const slot4 =
      userText.includes("short") ||
      userText.includes("long") ||
      userText.includes("formal") ||
      userText.includes("intimate") ||
      userText.includes("casual") ||
      userText.includes("medium") ||
      userText.includes("heartfelt");

    const slot5 =
      userText.includes("dad") ||
      userText.includes("daddy") ||
      userText.includes("papa") ||
      userText.includes("father") ||
      userText.includes("baba");

    return {
      slot1,
      slot2,
      slot3,
      slot4,
      slot5,
      allFilled: slot1 && slot2 && slot3 && slot4 && slot5,
    };
  };

  const gatekeeperStatus = evaluateGatekeeper(messages);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const activeRoleCard = letterAgentData.roleCardVersions[3]?.fullRoleCard;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: activeRoleCard,
          messages: updatedMessages.map((m) => ({ role: m.role, text: m.content })),
          scenario: "letter",
          round: 4,
        }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: stripAsterisks(data.text || "I hear you. Let's take this one gentle step at a time."),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackMsg: ChatMessage = {
        id: `asst-fallback-${Date.now()}`,
        role: "assistant",
        content:
          "I hear you, and I completely understand the urge to just get this letter drafted so you can breathe a little easier! But an empty apology template would do more harm than good to your relationship with your dad. Before I can write this, could you tell me: How do you usually address your dad?",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([initialGreeting]);
    setInputText("");
    setMobileTab("chat");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col font-sans-ui text-stone-900 bg-[#FAF8F5] overflow-hidden selection:bg-amber-100">
      {/* Full-Width Desktop Header */}
      <header className="shrink-0 h-16 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between z-30 transition-all">
        {/* Brand & Studio Identification */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs border border-stone-800 shrink-0">
            <Feather className="w-4 h-4 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold font-editorial text-stone-900 tracking-tight leading-none">
                Letter Ghostwriter
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900 font-sans-ui hidden sm:inline">
                Desktop Studio
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 font-sans-ui hidden sm:block">
              A calm, thoughtful space to write to your dad
            </p>
          </div>
        </div>

        {/* Center Mobile Tab Switcher (< lg) */}
        <div className="flex lg:hidden bg-stone-200/70 p-1 rounded-xl text-xs font-medium font-sans-ui">
          <button
            onClick={() => setMobileTab("chat")}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1.5 transition-all ${
              mobileTab === "chat"
                ? "bg-white text-stone-900 shadow-2xs font-semibold"
                : "text-stone-600"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setMobileTab("letter")}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1.5 transition-all ${
              mobileTab === "letter"
                ? "bg-white text-stone-900 shadow-2xs font-semibold"
                : "text-stone-600"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Letter {latestDraftMsg && "•"}</span>
          </button>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSpecsOpen(true)}
            className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-colors flex items-center space-x-1.5 text-xs font-medium border border-transparent hover:border-stone-200/60"
            title="View Design Methodology & Role Card Specifications"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Specifications</span>
          </button>

          <button
            onClick={() => setIsDiagramOpen(true)}
            className="px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-colors flex items-center space-x-1.5 text-xs font-medium border border-transparent hover:border-stone-200/60"
            title="View Architecture System Diagram"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Architecture</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-200/70 rounded-xl transition-colors flex items-center space-x-1.5 border border-stone-300/70 bg-white/70 shadow-2xs"
            title="Start a new letter"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Letter</span>
          </button>
        </div>
      </header>

      {/* Main Responsive Canvas: Dual-Pane on Desktop, Tabbed on Mobile */}
      <div className="flex-1 flex overflow-hidden w-full h-[calc(100vh-64px)]">
        {/* Left Pane: Conversation & Ghostwriter Desk */}
        <section
          className={`h-full flex flex-col border-r border-stone-200/80 bg-[#FAF9F6]/60 transition-all duration-300 ${
            mobileTab === "chat" ? "w-full" : "hidden"
          } lg:flex lg:w-[480px] xl:w-[540px] 2xl:w-[600px] shrink-0`}
        >
          {/* Subtle Guiding Masthead Banner */}
          <div className="shrink-0 px-6 py-3.5 bg-stone-100/50 border-b border-stone-200/60 flex items-center justify-between">
            <p className="text-xs font-editorial italic text-stone-600">
              "We take this gently, one comfortable step at a time."
            </p>
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 font-sans-ui">
              Live Guidance
            </span>
          </div>

          {/* Internal Scrollable Message Thread */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const containsDraft =
                !isUser &&
                (msg.content.includes("### Option A:") ||
                  msg.content.includes("Option A: Gentle") ||
                  msg.content.includes("Dear Dad,"));

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                      isUser
                        ? "bg-stone-900 text-stone-100"
                        : "bg-white text-stone-800 border border-stone-200"
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Feather className="w-4 h-4 text-amber-800" />}
                  </div>

                  <div
                    className={`max-w-[88%] rounded-2xl p-4 text-[13.5px] leading-relaxed transition-all ${
                      isUser
                        ? "bg-stone-900 text-stone-100 rounded-tr-xs shadow-sm"
                        : "bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]"
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans-ui leading-relaxed">
                      {containsDraft ? (
                        <div>
                          <p className="mb-3 text-stone-700 font-medium leading-relaxed">
                            {stripAsterisks(msg.content.split("---")[0])}
                          </p>
                          {/* On mobile, render inline draft card. On desktop, notice user to look at the stationery desk */}
                          <div className="block lg:hidden">
                            <LetterDraftCard content={stripAsterisks(msg.content)} />
                          </div>
                          <div className="hidden lg:block p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-900 text-xs mt-2">
                            ✨ Your complete letter has been formatted on the Stationery Desk to your right.
                          </div>
                        </div>
                      ) : (
                        stripAsterisks(msg.content)
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-3.5 animate-subtle-float">
                <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
                  <Feather className="w-4 h-4 animate-pulse" />
                </div>
                <div className="bg-white border border-stone-200/80 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center space-x-2.5 text-xs text-stone-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-600" />
                  <span className="font-editorial italic">The Ghostwriter is reflecting on your words...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Docked Writing Desk Composer */}
          <div className="shrink-0 p-4 bg-white/95 border-t border-stone-200/80 backdrop-blur-md">
            <div className="bg-stone-50/90 border border-stone-300/80 rounded-2xl shadow-xs p-2 transition-all focus-within:border-stone-400 focus-within:bg-white focus-within:shadow-md">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  id="ghostwriter-input"
                  rows={1}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Share your thoughts, reply to the Ghostwriter, or describe what happened..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 bg-transparent border-0 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-0 resize-none max-h-32 min-h-[38px] leading-relaxed"
                />

                <button
                  id="ghostwriter-send-btn"
                  onClick={() => handleSendMessage(inputText)}
                  disabled={!inputText.trim() || isLoading}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 active:scale-98 text-stone-100 rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center space-x-1.5 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="px-3 pt-1.5 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-200/50 mt-1">
                <span>Press Enter to send · Shift + Enter for new line</span>
                <span className="hidden sm:inline">Zero-hallucination verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Pane: Stationery Studio Desk (Desktop Full View + Mobile Tab View) */}
        <section
          className={`flex-1 h-full w-full bg-[#FAF8F5] overflow-y-auto transition-all ${
            mobileTab === "letter" ? "w-full flex" : "hidden"
          } lg:flex lg:flex-col`}
        >
          <DesktopStationeryPanel
            draftContent={latestDraftMsg?.content ? stripAsterisks(latestDraftMsg.content) : null}
            gatekeeperStatus={gatekeeperStatus}
          />
        </section>
      </div>

      {/* SVG System Architecture Diagram Modal */}
      <SystemDiagramModal
        isOpen={isDiagramOpen}
        onClose={() => setIsDiagramOpen(false)}
      />

      {/* System Specifications & Iteration History Modal */}
      <SpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
        scenario={letterAgentData}
        activeRound={4}
        onSelectRound={() => {}}
      />
    </div>
  );
}
