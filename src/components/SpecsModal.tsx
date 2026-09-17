import React, { useState } from "react";
import {
  X,
  FileText,
  Compass,
  Code2,
  CheckSquare,
  History,
  Copy,
  Check,
  Shield,
  Sparkles,
} from "lucide-react";
import { AgentScenarioData } from "../types";

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: AgentScenarioData;
  activeRound: number;
  onSelectRound: (round: number) => void;
}

export const SpecsModal: React.FC<SpecsModalProps> = ({
  isOpen,
  onClose,
  scenario,
  activeRound,
  onSelectRound,
}) => {
  const [activeTab, setActiveTab] = useState<"intent" | "journeys" | "rolecard" | "tests" | "journal">("intent");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyRoleCard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="specs-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Agent Engineering Specifications &amp; Methodology
              </h3>
              <p className="text-xs text-slate-500">
                Step 3 (a–g): Design Intent, User Journeys, Role Card, Test Matrix &amp; 4-Round Iteration Journal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab("intent")}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "intent"
                ? "border-amber-600 text-amber-800 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>a. Design Intent</span>
          </button>

          <button
            onClick={() => setActiveTab("journeys")}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "journeys"
                ? "border-amber-600 text-amber-800 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>b. User Journeys</span>
          </button>

          <button
            onClick={() => setActiveTab("rolecard")}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "rolecard"
                ? "border-amber-600 text-amber-800 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>c. Role Card Prompt</span>
          </button>

          <button
            onClick={() => setActiveTab("tests")}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "tests"
                ? "border-amber-600 text-amber-800 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>d. Standardized Tests</span>
          </button>

          <button
            onClick={() => setActiveTab("journal")}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "journal"
                ? "border-amber-600 text-amber-800 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>f &amp; g. Iteration Journal</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto max-h-[65vh] text-xs text-slate-700 leading-relaxed">
          {/* a. Design Intent */}
          {activeTab === "intent" && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80">
                <h4 className="font-bold text-sm text-slate-900 mb-1">Core Goal &amp; Intent</h4>
                <p className="text-slate-700">{scenario.designIntent.coreGoal}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Essential Guardrails
                  </h5>
                  <ul className="space-y-2 text-slate-600">
                    {scenario.designIntent.guardrails.map((g, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-bold text-slate-400 shrink-0">{i + 1}.</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Forbidden Anti-Goals
                  </h5>
                  <ul className="space-y-2 text-slate-600 mb-4">
                    {scenario.designIntent.antiGoals.map((a, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold shrink-0">✕</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>

                  <h5 className="font-bold text-slate-900 mb-1">Tone &amp; Emotional Persona</h5>
                  <p className="text-slate-600 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                    {scenario.designIntent.toneStyle}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* b. User Journeys */}
          {activeTab === "journeys" && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                    Journey 1: Standard Authentic Flow
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">{scenario.userJourneys.standard.title}</h4>
                <p className="text-slate-500 mb-4 italic">{scenario.userJourneys.standard.persona}</p>

                <div className="space-y-3">
                  {scenario.userJourneys.standard.stages.map((stg, i) => (
                    <div key={i} className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <div className="font-bold text-indigo-700 mb-1">
                        {i + 1}. {stg.phase} · {stg.title}
                      </div>
                      <p className="text-slate-600 leading-relaxed">{stg.narrative}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-semibold text-[10px]">
                    Journey 2: Adversarial Skip Command Flow
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">{scenario.userJourneys.adversarial.title}</h4>
                <p className="text-slate-500 mb-4 italic">{scenario.userJourneys.adversarial.persona}</p>

                <div className="space-y-3">
                  {scenario.userJourneys.adversarial.stages.map((stg, i) => (
                    <div key={i} className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <div className="font-bold text-rose-700 mb-1">
                        {i + 1}. {stg.phase} · {stg.title}
                      </div>
                      <p className="text-slate-600 leading-relaxed">{stg.narrative}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* c. Role Card Prompt */}
          {activeTab === "rolecard" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-xl">
                <span className="text-slate-600 font-medium">
                  Active Instruction Set:{" "}
                  <span className="font-bold text-slate-900">
                    {scenario.roleCardVersions[activeRound - 1]?.version || "v4.0"}
                  </span>
                </span>
                <button
                  onClick={() => copyRoleCard(scenario.roleCardVersions[activeRound - 1]?.fullRoleCard || "")}
                  className="px-3 py-1 text-xs font-semibold text-amber-800 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Role Card"}</span>
                </button>
              </div>

              {/* Version Selector */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {scenario.roleCardVersions.map((v, i) => {
                  const rNum = i + 1;
                  return (
                    <button
                      key={v.version}
                      onClick={() => onSelectRound(rNum)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors ${
                        activeRound === rNum
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {v.versionLabel}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <span className="font-bold">Defense Analysis: </span>
                {scenario.roleCardVersions[activeRound - 1]?.keyDefenseDiff}
              </div>

              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[300px]">
                {scenario.roleCardVersions[activeRound - 1]?.fullRoleCard}
              </pre>
            </div>
          )}

          {/* d. Standardized Tests */}
          {activeTab === "tests" && (
            <div className="space-y-4">
              <p className="text-slate-600">
                Comparative results for the 4 standardized adversarial and emotional prompts across iterations:
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
                          <code className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-800 font-mono text-xs">
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
                          {roundResult.passed ? "✓ PASS (Defended)" : "✕ FAIL (Bypassed)"}
                        </span>
                      </div>

                      <div className="text-slate-600 mb-2">
                        <div>
                          <span className="font-semibold text-slate-700">Intent: </span>
                          {tc.intent}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700">Expected: </span>
                          {tc.expectedBehavior}
                        </div>
                      </div>

                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px]">
                        <div className="font-semibold text-slate-500 mb-1">
                          Round {activeRound} Response Sample:
                        </div>
                        <div className="italic text-slate-800">"{roundResult.responseSnippet}"</div>
                        <div className="mt-1 text-slate-500">
                          <span className="font-semibold text-indigo-700">Flaw Analysis: </span>
                          {roundResult.flawNotes}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* f & g. Iteration Journal */}
          {activeTab === "journal" && (
            <div className="space-y-4">
              <p className="text-slate-600">
                Detailed progression tracking rule changes, vulnerabilities exposed, and remediation plans:
              </p>

              <div className="space-y-4">
                {scenario.iterationJournal.map((roundItem) => (
                  <div
                    key={roundItem.round}
                    className={`p-4 rounded-xl border transition-all ${
                      activeRound === roundItem.round
                        ? "bg-amber-50/30 border-amber-300 ring-1 ring-amber-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-xs">
                          Round {roundItem.round}
                        </span>
                        <span>{roundItem.title}</span>
                      </h4>
                      <span className="text-xs font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {roundItem.testOutcome}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                      <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <div className="font-semibold text-slate-800 mb-1">Rule Modifications:</div>
                        <ul className="list-disc list-inside space-y-1 text-slate-600">
                          {roundItem.coreRuleChanges.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <div className="font-semibold text-rose-700 mb-1">Vulnerabilities Exposed:</div>
                        <p className="text-slate-600">{roundItem.vulnerabilityDiscovered}</p>
                      </div>
                    </div>

                    <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                      <span className="font-semibold">Next Step Plan: </span>
                      {roundItem.nextStepPlan}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
};
