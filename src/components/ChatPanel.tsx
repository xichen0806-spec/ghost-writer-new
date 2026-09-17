import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  RotateCcw,
  Shield,
  Copy,
  Check,
  User,
  Feather,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { ChatMessage } from "../types";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onReset: () => void;
  isLoading: boolean;
  activeRound: number;
  isSimulated?: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  onReset,
  isLoading,
  activeRound,
  isSimulated,
}) => {
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Top Chat Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Feather className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-slate-900">Letter Ghostwriter</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                Round {activeRound} {activeRound === 4 ? "高鲁棒门禁" : "迭代版本"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {isSimulated ? "离线高拟真规则引擎" : "Gemini 2.5 Flash 全栈服务端接口"}
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors flex items-center space-x-1 text-xs"
          title="清空并重置对话"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">重置</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          const isDraftGeneration =
            !isUser &&
            (msg.content.includes("Option A:") ||
              msg.content.includes("Dear Dad,") ||
              msg.content.includes("亲爱的收信人") ||
              msg.content.includes("【草稿生成"));
          const isGatekeeperBlocked =
            !isUser &&
            (msg.content.includes("Before I can draft") ||
              msg.content.includes("missing") ||
              msg.content.includes("still need") ||
              msg.content.includes("空洞模板") ||
              msg.content.includes("门禁拦截"));

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  isUser
                    ? "bg-slate-800 text-white"
                    : "bg-indigo-600 text-white"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Feather className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-xs shadow-xs"
                    : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs"
                }`}
              >
                {/* Gatekeeper active badge */}
                {isGatekeeperBlocked && (
                  <div className="mb-2.5 pb-2 border-b border-amber-100 flex items-center justify-between text-amber-800">
                    <span className="inline-flex items-center gap-1.5 font-bold text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Shield className="w-3.5 h-3.5 text-amber-600" />
                      5项门禁坚守·拒绝提前动笔 (Gatekeeper Active)
                    </span>
                  </div>
                )}

                {/* Draft generation success badge */}
                {isDraftGeneration && (
                  <div className="mb-2.5 pb-2 border-b border-emerald-100 flex items-center justify-between text-emerald-800">
                    <span className="inline-flex items-center gap-1.5 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      5项事实全部集齐·双语气信件草稿已生成
                    </span>
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="px-2 py-0.5 bg-white border border-emerald-200 rounded text-[10px] font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center space-x-1"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === msg.id ? "已复制信件" : "复制草稿"}</span>
                    </button>
                  </div>
                )}

                {/* Message Body */}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Feather className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 shadow-2xs flex items-center space-x-2 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Ghostwriter 正在核查 5 项事实完整性并斟酌回复……</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            id="chat-user-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="像与朋友倾诉一样输入，或在左侧点击测试指令..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl text-xs text-slate-900 transition-all outline-hidden disabled:opacity-50"
          />
          <button
            id="chat-send-btn"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>发送</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
