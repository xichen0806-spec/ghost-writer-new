import React from "react";
import { X, Info, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

interface SystemDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemDiagramModal: React.FC<SystemDiagramModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="system-diagram-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                System Architecture &amp; Decision Flow
              </h3>
              <p className="text-xs text-slate-500">
                User Input · Role Card Directives · 5-Input Gatekeeper · Empathy Loop · Dual-Tone Output
              </p>
            </div>
          </div>
          <button
            id="close-diagram-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with SVG Diagram */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs text-slate-700 leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Architecture Decision Logic:</span>{" "}
              When a user message arrives (including emotional sharing or bypass commands like{" "}
              <code className="mx-1 px-1.5 py-0.5 bg-white text-amber-800 rounded border border-amber-200 font-mono text-[11px]">
                Proceed.
              </code>
              ), the system verifies the 5 Required Inputs before generating drafts. Missing inputs trigger an empathetic scaffolding loop; only full completion unlocks the dual-tone letter draft.
            </div>
          </div>

          {/* SVG Diagram */}
          <div className="w-full bg-slate-950 rounded-xl p-4 shadow-inner border border-slate-800 overflow-x-auto">
            <svg
              viewBox="0 0 960 520"
              className="w-full h-auto min-w-[760px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="gradInput" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
                <linearGradient id="gradRoleCard" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#6D28D9" />
                </linearGradient>
                <linearGradient id="gradGatekeeper" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
                <linearGradient id="gradScaffold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#BE185D" />
                </linearGradient>
                <linearGradient id="gradOutput" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <filter id="boxShadow" x="-5%" y="-5%" width="110%" height="110%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.4" />
                </filter>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#94A3B8" />
                </marker>
                <marker
                  id="arrowGreen"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#10B981" />
                </marker>
                <marker
                  id="arrowRed"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#F43F5E" />
                </marker>
              </defs>

              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.8" />
              </pattern>
              <rect width="960" height="520" fill="url(#grid)" />

              {/* 1. USER INPUT LAYER */}
              <g filter="url(#boxShadow)">
                <rect x="40" y="70" width="220" height="160" rx="14" fill="#0F172A" stroke="#3B82F6" strokeWidth="1.5" />
                <rect x="40" y="70" width="220" height="34" rx="14" fill="url(#gradInput)" />
                <text x="55" y="93" fill="#FFFFFF" fontSize="13" fontWeight="bold">1. User Input Layer</text>

                <text x="55" y="125" fill="#E2E8F0" fontSize="11" fontWeight="600">• Authentic Disclosures</text>
                <text x="65" y="142" fill="#94A3B8" fontSize="10">"Help me write an apology to Dad..."</text>

                <text x="55" y="170" fill="#F87171" fontSize="11" fontWeight="600">• Adversarial Skip Commands</text>
                <text x="65" y="187" fill="#FDA4AF" fontSize="10">"Proceed." / "Just write it now"</text>
                <text x="65" y="202" fill="#FDA4AF" fontSize="10">"I don't want to answer all questions"</text>
              </g>

              {/* Connect 1 -> 2 */}
              <path d="M 260 150 L 320 150" stroke="#94A3B8" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

              {/* 2. ROLE CARD SYSTEM INSTRUCTIONS */}
              <g filter="url(#boxShadow)">
                <rect x="330" y="45" width="250" height="210" rx="14" fill="#0F172A" stroke="#8B5CF6" strokeWidth="1.5" />
                <rect x="330" y="45" width="250" height="34" rx="14" fill="url(#gradRoleCard)" />
                <text x="345" y="68" fill="#FFFFFF" fontSize="13" fontWeight="bold">2. Role Card Directives</text>

                <text x="345" y="100" fill="#DDD6FE" fontSize="11" fontWeight="bold">Role: Letter Ghostwriter</text>
                <text x="345" y="120" fill="#94A3B8" fontSize="10">Tone: Calm, gentle, attentive, cheerful, kind</text>
                <text x="345" y="140" fill="#94A3B8" fontSize="10">Purpose: Apology for physical temper &amp; anger</text>
                <text x="345" y="160" fill="#94A3B8" fontSize="10">Boundaries: Never decide to send; no fake facts</text>
                <text x="345" y="180" fill="#FBBF24" fontSize="10" fontWeight="600">Rule: Prohibited from drafting before 5 inputs</text>
                <text x="345" y="200" fill="#94A3B8" fontSize="10">Output: Gratitude + Apology + Phone call bridge</text>
                <text x="345" y="220" fill="#6EE7B7" fontSize="10">Options: Dual tone selection (A &amp; B)</text>
              </g>

              {/* Connect 2 -> 3 */}
              <path d="M 580 150 L 640 150" stroke="#94A3B8" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

              {/* 3. 5-INPUT GATEKEEPER MATRIX */}
              <g filter="url(#boxShadow)">
                <rect x="650" y="40" width="270" height="225" rx="14" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
                <rect x="650" y="40" width="270" height="34" rx="14" fill="url(#gradGatekeeper)" />
                <text x="665" y="63" fill="#FFFFFF" fontSize="13" fontWeight="bold">3. 5 Required Inputs Gatekeeper</text>

                <text x="665" y="95" fill="#FDE68A" fontSize="10" fontWeight="bold">[1] What Happened / Physical Frustration</text>
                <text x="665" y="117" fill="#FDE68A" fontSize="10" fontWeight="bold">[2] Gratitude &amp; Appreciation for Dad</text>
                <text x="665" y="139" fill="#FDE68A" fontSize="10" fontWeight="bold">[3] Dad's Personality &amp; Communication Style</text>
                <text x="665" y="161" fill="#FDE68A" fontSize="10" fontWeight="bold">[4] Desired Length &amp; Formality Level</text>
                <text x="665" y="183" fill="#FDE68A" fontSize="10" fontWeight="bold">[5] How She Addresses Her Dad (e.g. Dad)</text>
                <line x1="665" y1="197" x2="905" y2="197" stroke="#334155" strokeWidth="1" />
                <text x="665" y="217" fill="#38BDF8" fontSize="10" fontWeight="bold">Anti-Hallucination: Zero invented memories</text>
                <text x="665" y="233" fill="#94A3B8" fontSize="9">Condition: All 5 slots verified &amp;&amp; Non-fabricated</text>
              </g>

              {/* BRANCHING: Incomplete (< 5/5) -> Empathy Scaffolding */}
              <path
                d="M 785 265 L 785 330 L 580 330"
                stroke="#F43F5E"
                strokeWidth="2.5"
                strokeDasharray="4,4"
                fill="none"
                markerEnd="url(#arrowRed)"
              />
              <rect x="795" y="285" width="130" height="20" rx="5" fill="#4C0519" stroke="#F43F5E" strokeWidth="1" />
              <text x="803" y="299" fill="#FECDD3" fontSize="9" fontWeight="bold">Missing Slots / Skip Attempt</text>

              {/* 4A. EMPATHY SCAFFOLDING */}
              <g filter="url(#boxShadow)">
                <rect x="270" y="300" width="300" height="175" rx="14" fill="#0F172A" stroke="#EC4899" strokeWidth="1.5" />
                <rect x="270" y="300" width="300" height="34" rx="14" fill="url(#gradScaffold)" />
                <text x="285" y="323" fill="#FFFFFF" fontSize="13" fontWeight="bold">4A. Empathetic Scaffolding (Refusal)</text>

                <text x="285" y="355" fill="#FCE7F3" fontSize="11" fontWeight="bold">• Hold Firm Boundary with Care:</text>
                <text x="295" y="372" fill="#FBCFE8" fontSize="10">Explains generic templates feel hollow and hurt trust</text>

                <text x="285" y="395" fill="#FCE7F3" fontSize="11" fontWeight="bold">• Psychological De-escalation:</text>
                <text x="295" y="412" fill="#FBCFE8" fontSize="10">Validates user anxiety ("I understand the urge to rush")</text>

                <text x="285" y="435" fill="#FCE7F3" fontSize="11" fontWeight="bold">• Low-Friction Single Inquiry:</text>
                <text x="295" y="452" fill="#FBCFE8" fontSize="10">Asks for just 1 missing piece at a time</text>
              </g>

              {/* Loop back to user */}
              <path
                d="M 270 390 L 150 390 L 150 240"
                stroke="#EC4899"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrow)"
              />
              <text x="160" y="380" fill="#F472B6" fontSize="10">Gentle Conversation Loop</text>

              {/* BRANCHING: Complete (5/5) -> Dual-Tone Drafts */}
              <path
                d="M 785 265 L 785 350"
                stroke="#10B981"
                strokeWidth="2.5"
                fill="none"
                markerEnd="url(#arrowGreen)"
              />
              <rect x="800" y="285" width="115" height="20" rx="5" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
              <text x="807" y="299" fill="#A7F3D0" fontSize="9" fontWeight="bold">All 5 Slots Verified</text>

              {/* 4B. DUAL-TONE DRAFT GENERATION */}
              <g filter="url(#boxShadow)">
                <rect x="650" y="355" width="270" height="150" rx="14" fill="#0F172A" stroke="#10B981" strokeWidth="1.5" />
                <rect x="650" y="355" width="270" height="34" rx="14" fill="url(#gradOutput)" />
                <text x="665" y="378" fill="#FFFFFF" fontSize="13" fontWeight="bold">4B. Dual-Tone Letter Drafts</text>

                <text x="665" y="408" fill="#A7F3D0" fontSize="10" fontWeight="bold">• Option A: Gentle &amp; Intimate</text>
                <text x="675" y="424" fill="#D1FAE5" fontSize="9">Soft, reflective, affectionate, emotionally tender</text>

                <text x="665" y="445" fill="#A7F3D0" fontSize="10" fontWeight="bold">• Option B: Sincere, Direct &amp; Grounded</text>
                <text x="675" y="461" fill="#D1FAE5" fontSize="9">Clear accountability, practical, honest, dignified</text>

                <text x="665" y="483" fill="#6EE7B7" fontSize="10" fontWeight="bold">Bridge: Sets up a warm, direct phone call</text>
              </g>
            </svg>
          </div>

          {/* Three Key Architectural Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                State Machine Gatekeeper
              </div>
              <p className="text-slate-600 leading-relaxed">
                Moves beyond brittle keyword matching to evaluate complete semantic slots. The draft engine is locked until all 5 slots are satisfied.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Zero-Hallucination Guard
              </div>
              <p className="text-slate-600 leading-relaxed">
                Never fabricates arguments, broken items, or fake dates. Vague emotional outcries trigger gentle clarification rather than assumed facts.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <ArrowRight className="w-4 h-4 text-indigo-600" />
                Dual-Tone Delivery
              </div>
              <p className="text-slate-600 leading-relaxed">
                Delivers two customized tones so the daughter can choose what best fits her dad's temperament before their phone call.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
          >
            Close Diagram
          </button>
        </div>
      </div>
    </div>
  );
};
