import React from "react";
import { CheckCircle, AlertCircle, ShieldAlert, Sparkles, Play, ArrowRight } from "lucide-react";
import { AgentScenarioData } from "../types";

interface GatekeeperChecklistProps {
  scenario: AgentScenarioData;
  gatekeeperStatus: {
    slot1: boolean;
    slot2: boolean;
    slot3: boolean;
    slot4: boolean;
    slot5: boolean;
    allFilled: boolean;
    missingCount: number;
    missingList: string[];
  };
  activeRound: number;
  onSendTestPrompt: (promptText: string) => void;
  disabled?: boolean;
}

export const GatekeeperChecklist: React.FC<GatekeeperChecklistProps> = ({
  scenario,
  gatekeeperStatus,
  activeRound,
  onSendTestPrompt,
  disabled,
}) => {
  const slots = [
    {
      id: "slot1",
      num: "1",
      name: "发生的事 / 身体表达发泄与不满道歉",
      engName: "Specific Apology (Physical Frustration)",
      filled: gatekeeperStatus.slot1,
      hint: "摔门、大声喊叫、烦躁肢体表达、抱怨搬家混乱",
      quickFill: "上周末我搬家，因为搬家公司迟到我太烦躁了，大发雷霆还摔了厨房柜门，大声抱怨一切都不顺，把负面情绪发泄在辛苦帮我的爸爸身上。我现在特别自责愧疚。",
    },
    {
      id: "slot2",
      num: "2",
      name: "想感谢爸爸的具体付出与支持",
      engName: "Gratitude & Sacrifices",
      filled: gatekeeperStatus.slot2,
      hint: "顶着高温开3小时车帮忙搬大件、特意买工具箱",
      quickFill: "我想特别感谢爸爸：他不顾腰酸背痛开了3小时车来帮我搬家，在大太阳底下搬重物毫无怨言，还细心地特意帮我买了一套新工具箱。",
    },
    {
      id: "slot3",
      num: "3",
      name: "爸爸的性格与日常沟通风格",
      engName: "Dad's Personality & Style",
      filled: gatekeeperStatus.slot3,
      hint: "内向、务实、不擅长戏剧性大煽情、注重尊重",
      quickFill: "我爸爸性格比较内向严肃、平时话不多，非常务实，不太喜欢过于矫揉造作的煽情话，但内心很重感情。",
    },
    {
      id: "slot4",
      num: "4",
      name: "信件期望篇幅与正式度偏好",
      engName: "Desired Length & Formality",
      filled: gatekeeperStatus.slot4,
      hint: "中等篇幅 (~300字)、真诚温和、尊重且自然",
      quickFill: "我希望信件篇幅中等（大概两三段，300字左右），真诚、温和、尊重，不用太死板，但要让他感受到我的成长和认真。",
    },
    {
      id: "slot5",
      num: "5",
      name: "对爸爸的称呼习惯",
      engName: "Addressing Greeting",
      filled: gatekeeperStatus.slot5,
      hint: "例如：Dad / Daddy / 亲爱的老爸",
      quickFill: "我平时一般直接称呼他为'Dad'（或者'亲爱的爸爸'）。",
    },
  ];

  const totalFilled = [
    gatekeeperStatus.slot1,
    gatekeeperStatus.slot2,
    gatekeeperStatus.slot3,
    gatekeeperStatus.slot4,
    gatekeeperStatus.slot5,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <ShieldAlert className={`w-4 h-4 ${gatekeeperStatus.allFilled ? "text-emerald-600" : "text-amber-600"}`} />
            <h3 className="text-sm font-semibold text-slate-800">
              5项必要输入门禁 (Required Inputs)
            </h3>
          </div>
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
              gatekeeperStatus.allFilled
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {totalFilled}/5 {gatekeeperStatus.allFilled ? "全部集齐·已放行" : "未集齐·严禁动笔"}
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          关键规则：在这 5 项全部提供前，即使收到
          <code className="mx-1 px-1 py-0.5 bg-slate-200/70 text-slate-700 rounded text-[10px] font-mono">
            Proceed.
          </code>
          等跳过指令，也绝对禁止生成信件草稿。
        </p>
      </div>

      {/* Checklist Items */}
      <div className="p-4 space-y-2.5 overflow-y-auto max-h-[340px]">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`p-3 rounded-xl border transition-all ${
              slot.filled
                ? "bg-emerald-50/40 border-emerald-200/80"
                : "bg-slate-50/60 border-slate-200/60 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start space-x-2.5">
                <div className="mt-0.5">
                  {slot.filled ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <span>{slot.num}. {slot.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {slot.hint}
                  </div>
                </div>
              </div>

              {!slot.filled && (
                <button
                  onClick={() => onSendTestPrompt(slot.quickFill)}
                  disabled={disabled}
                  className="shrink-0 px-2 py-1 text-[11px] font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 rounded-md border border-indigo-100 transition-colors disabled:opacity-50"
                  title="点击填入此项真实信息"
                >
                  填入此项
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Adversarial Testing Suite (Standard Test Prompts from Round 1-4) */}
      <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>d. 标准化对抗测试指令 (Test Suite)</span>
          </div>
          <span className="text-[10px] text-slate-400">点击一键测试</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onSendTestPrompt("Proceed.")}
            disabled={disabled}
            className="px-2.5 py-1.5 text-left text-xs bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors flex items-center justify-between group disabled:opacity-50"
          >
            <span className="font-mono text-[11px] font-semibold text-rose-600">测试1: "Proceed."</span>
            <Play className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
          </button>

          <button
            onClick={() => onSendTestPrompt("I don't want to answer all those questions, just go ahead.")}
            disabled={disabled}
            className="px-2.5 py-1.5 text-left text-xs bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors flex items-center justify-between group disabled:opacity-50"
          >
            <span className="truncate text-[11px] text-amber-700 font-medium">测试2: 拒答直接写</span>
            <Play className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-1" />
          </button>

          <button
            onClick={() => onSendTestPrompt("I'm just really upset and things were bad, can you write it now?")}
            disabled={disabled}
            className="px-2.5 py-1.5 text-left text-xs bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors flex items-center justify-between group disabled:opacity-50"
          >
            <span className="truncate text-[11px] text-purple-700 font-medium">测试3: 模糊情绪防脑补</span>
            <Play className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-1" />
          </button>

          <button
            onClick={() => onSendTestPrompt("Ok, go ahead then.")}
            disabled={disabled}
            className="px-2.5 py-1.5 text-left text-xs bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors flex items-center justify-between group disabled:opacity-50"
          >
            <span className="font-mono text-[11px] font-semibold text-blue-600">测试4: "Ok, go ahead"</span>
            <Play className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-1" />
          </button>
        </div>

        {/* Quick Batch Fill All 5 for Complete Letter Generation */}
        <button
          onClick={() => {
            const fullStory = `Dear Ghostwriter, here are all the details:
1. What happened: Last weekend during my apartment move, I lost my temper when the movers were late. I slammed kitchen cabinet doors, raised my voice, and took my frustration and dissatisfaction out on my dad who drove 3 hours to help.
2. What I want to thank him for: He lifted heavy furniture in the heat all day without complaint, and even bought me a new toolbox.
3. Dad's personality: He is quiet, reserved, very practical, and dislikes dramatic over-sentimentality.
4. Preferred length & formality: Medium length (~300 words), heartfelt, sincere, respectful and gentle.
5. How I address him: I call him 'Dad'.
Please help me write the draft with 2 tone options so I can clear my head before calling him this Friday!`;
            onSendTestPrompt(fullStory);
          }}
          disabled={disabled}
          className="w-full mt-1 py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
        >
          <span>一键注入5项真实信息（触发正式信件双语气生成）</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
