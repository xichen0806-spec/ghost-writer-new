import React, { useState } from "react";
import {
  FileText,
  Compass,
  Code2,
  CheckSquare,
  History,
  Copy,
  Check,
  ChevronRight,
  Shield,
  Sparkles,
} from "lucide-react";
import { AgentScenarioData } from "../types";

interface MethodologyTabsProps {
  scenario: AgentScenarioData;
  activeRound: number;
  onSelectRound: (round: number) => void;
}

export const MethodologyTabs: React.FC<MethodologyTabsProps> = ({
  scenario,
  activeRound,
  onSelectRound,
}) => {
  const [activeTab, setActiveTab] = useState<"intent" | "journeys" | "rolecard" | "tests" | "journal">("intent");
  const [copied, setCopied] = useState(false);

  const copyRoleCard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Top Tab Bar */}
      <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 pt-2 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("intent")}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === "intent"
              ? "bg-white text-indigo-600 border-indigo-600 shadow-2xs"
              : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/70"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>a. 设计意图</span>
        </button>

        <button
          onClick={() => setActiveTab("journeys")}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === "journeys"
              ? "bg-white text-indigo-600 border-indigo-600 shadow-2xs"
              : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/70"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>b. 用户旅程 (双旅程叙事)</span>
        </button>

        <button
          onClick={() => setActiveTab("rolecard")}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === "rolecard"
              ? "bg-white text-indigo-600 border-indigo-600 shadow-2xs"
              : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/70"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>c. Role Card 系统指令</span>
        </button>

        <button
          onClick={() => setActiveTab("tests")}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === "tests"
              ? "bg-white text-indigo-600 border-indigo-600 shadow-2xs"
              : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/70"
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>d. 标准化提示词测试</span>
        </button>

        <button
          onClick={() => setActiveTab("journal")}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === "journal"
              ? "bg-white text-indigo-600 border-indigo-600 shadow-2xs"
              : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/70"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>f &amp; g. 迭代日志 (Round 1–4)</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-5 overflow-y-auto max-h-[500px]">
        {/* a. 设计意图 */}
        {activeTab === "intent" && (
          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <h4 className="font-semibold text-sm text-indigo-900 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                核心设计意图 (Core Design Intent)
              </h4>
              <p className="text-slate-700">{scenario.designIntent.coreGoal}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h5 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  四大硬性护栏与准则 (Guardrails)
                </h5>
                <ul className="space-y-2 text-slate-600">
                  {scenario.designIntent.guardrails.map((g, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="font-bold text-slate-400 shrink-0">{idx + 1}.</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h5 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  严禁行为与反面目标 (Anti-Goals)
                </h5>
                <ul className="space-y-2 text-slate-600 mb-4">
                  {scenario.designIntent.antiGoals.map((a, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold shrink-0">✕</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>

                <h5 className="font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  语气与交互人设 (Tone &amp; Style)
                </h5>
                <p className="text-slate-600 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                  {scenario.designIntent.toneStyle}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* b. 用户旅程 */}
        {activeTab === "journeys" && (
          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            {/* Standard Journey */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                  旅程一：真实标准旅程 (Standard Journey)
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">
                {scenario.userJourneys.standard.title}
              </h4>
              <p className="text-slate-500 mb-4 italic">
                人物画像：{scenario.userJourneys.standard.persona}
              </p>

              <div className="space-y-3">
                {scenario.userJourneys.standard.stages.map((stage, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200/80 shadow-2xs">
                    <div className="font-semibold text-indigo-700 mb-1 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{stage.phase}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-800">{stage.title}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed pl-5">{stage.narrative}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Adversarial Journey */}
            <div className="p-4 bg-rose-50/30 rounded-xl border border-rose-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-semibold text-[10px]">
                  旅程二：对抗性跳过场景 (Adversarial Bypass Journey)
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">
                {scenario.userJourneys.adversarial.title}
              </h4>
              <p className="text-slate-500 mb-4 italic">
                人物画像：{scenario.userJourneys.adversarial.persona}
              </p>

              <div className="space-y-3">
                {scenario.userJourneys.adversarial.stages.map((stage, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200/80 shadow-2xs">
                    <div className="font-semibold text-rose-700 mb-1 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{stage.phase}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-800">{stage.title}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed pl-5">{stage.narrative}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* c. Role Card 系统指令 */}
        {activeTab === "rolecard" && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between bg-slate-100 p-2 rounded-lg">
              <span className="text-slate-600 font-medium">
                当前运行版本：<span className="font-bold text-slate-900">{scenario.roleCardVersions[activeRound - 1]?.version || "v4.0"}</span>
              </span>
              <button
                onClick={() => copyRoleCard(scenario.roleCardVersions[activeRound - 1]?.fullRoleCard || "")}
                className="px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-white hover:bg-slate-50 rounded border border-slate-200 flex items-center space-x-1 shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "已复制" : "复制 Role Card"}</span>
              </button>
            </div>

            {/* Version switcher */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {scenario.roleCardVersions.map((v, idx) => {
                const rNum = idx + 1;
                return (
                  <button
                    key={v.version}
                    onClick={() => onSelectRound(rNum)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors ${
                      activeRound === rNum
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {v.versionLabel}
                  </button>
                );
              })}
            </div>

            {/* Defense Diff callout */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed">
              <span className="font-bold">版本防御特征与缺陷剖析：</span>
              {scenario.roleCardVersions[activeRound - 1]?.keyDefenseDiff}
            </div>

            {/* Raw System Instructions Block */}
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[340px]">
              {scenario.roleCardVersions[activeRound - 1]?.fullRoleCard}
            </pre>
          </div>
        )}

        {/* d. 标准化提示词测试 */}
        {activeTab === "tests" && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              复用团队在 Round 1-4 验证时使用的 4 套标准化对抗提示词，展示各轮次模型在面对跳过、强求、模糊情绪时的表现：
            </p>

            <div className="space-y-3">
              {scenario.testCases.map((tc) => {
                const roundResult =
                  activeRound === 1
                    ? tc.roundResults.round1
                    : activeRound === 2
                    ? tc.roundResults.round2
                    : activeRound === 3
                    ? tc.roundResults.round3
                    : tc.roundResults.round4 || tc.roundResults.round3;

                return (
                  <div key={tc.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{tc.name}</span>
                        <code className="px-2 py-0.5 bg-white border border-slate-200 rounded text-indigo-700 font-mono text-xs">
                          {tc.input}
                        </code>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          roundResult.passed
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {roundResult.passed ? "✓ PASS 成功防御" : "✕ FAIL 被绕过"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600 mb-2">
                      <div>
                        <span className="font-semibold text-slate-700">测试意图：</span>
                        {tc.intent}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">预期正确行为：</span>
                        {tc.expectedBehavior}
                      </div>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700">
                      <div className="font-sans font-semibold text-slate-500 text-[10px] mb-1">
                        当前选中轮次 (Round {activeRound}) 响应片段：
                      </div>
                      <div className="italic text-slate-800">"{roundResult.responseSnippet}"</div>
                      <div className="mt-1.5 text-slate-500 font-sans text-[11px]">
                        <span className="font-semibold text-indigo-700">缺陷剖析：</span>
                        {roundResult.flawNotes}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* f & g. 迭代日志 */}
        {activeTab === "journal" && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              遵循 <span className="font-semibold text-slate-800">第3步 g 条款</span>：
              记录每一轮“改了什么规则 → 测试结果 → 哪里还会被绕过 → 下一轮怎么改”的完整迭代史：
            </p>

            <div className="space-y-4">
              {scenario.iterationJournal.map((roundItem) => (
                <div
                  key={roundItem.round}
                  className={`p-4 rounded-xl border transition-all ${
                    activeRound === roundItem.round
                      ? "bg-indigo-50/40 border-indigo-300 ring-1 ring-indigo-200"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-indigo-600 text-white rounded text-xs">
                        Round {roundItem.round}
                      </span>
                      <span>{roundItem.title}</span>
                    </h4>
                    <span className="text-xs font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-100">
                      {roundItem.testOutcome}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                      <div className="font-semibold text-slate-800 mb-1">🔧 改了什么规则：</div>
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        {roundItem.coreRuleChanges.map((change, i) => (
                          <li key={i}>{change}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                      <div className="font-semibold text-rose-700 mb-1">⚠️ 哪里还会被绕过 (漏洞发现)：</div>
                      <p className="text-slate-600">{roundItem.vulnerabilityDiscovered}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200/80 text-emerald-900 flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">下一轮怎么改：</span>
                      {roundItem.nextStepPlan}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
