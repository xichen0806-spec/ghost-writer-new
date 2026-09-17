import React from "react";
import { X, CheckCircle, AlertCircle, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";

interface PreparationChecklistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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
  onQuickFill: (text: string) => void;
  disabled?: boolean;
}

export const PreparationChecklistDrawer: React.FC<PreparationChecklistDrawerProps> = ({
  isOpen,
  onClose,
  gatekeeperStatus,
  onQuickFill,
  disabled,
}) => {
  if (!isOpen) return null;

  const slots = [
    {
      num: 1,
      name: "1. What Happened / Specific Apology",
      filled: gatekeeperStatus.slot1,
      desc: "Physical expressions of frustration (e.g., slamming cabinet doors, raised voice) and unfair venting.",
      sample: "Last weekend during my apartment move, I lost my temper when the movers were late. I slammed kitchen cabinet doors, raised my voice, and took my frustration out on my dad who drove 3 hours to help. I feel deeply remorseful.",
    },
    {
      num: 2,
      name: "2. Gratitude & Sacrifices for Dad",
      filled: gatekeeperStatus.slot2,
      desc: "Concrete support, practical help, and quiet acts of care you appreciate.",
      sample: "I want to thank him for spending his entire Saturday lifting heavy furniture in the sweltering heat without a word of complaint, and for thoughtfully buying a new toolbox for my apartment.",
    },
    {
      num: 3,
      name: "3. Dad's Personality & Communication Style",
      filled: gatekeeperStatus.slot3,
      desc: "His temperament and how he receives words (quiet, practical, reserved, direct).",
      sample: "He is a quiet, reserved, very practical man who values honesty and calm respect, and dislikes overly dramatic or theatrical emotional scenes.",
    },
    {
      num: 4,
      name: "4. Desired Letter Length & Formality",
      filled: gatekeeperStatus.slot4,
      desc: "Length preference (medium ~300 words) and tone balance (sincere, respectful, heartfelt).",
      sample: "I'd like a medium-length letter (~250-350 words), deeply sincere, respectful and gentle, giving him space to process before our phone call.",
    },
    {
      num: 5,
      name: "5. How You Address Him",
      filled: gatekeeperStatus.slot5,
      desc: "Your personal greeting (e.g., Dad, Daddy, Papa).",
      sample: "I call him 'Dad'.",
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className={`w-5 h-5 ${gatekeeperStatus.allFilled ? "text-emerald-600" : "text-amber-600"}`} />
            <div>
              <h3 className="text-sm font-bold text-slate-900">5 Preparation Details</h3>
              <p className="text-xs text-slate-500">
                {totalFilled} of 5 verified {gatekeeperStatus.allFilled ? "· Ready to Draft" : "· In Progress"}
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

        {/* List of 5 slots */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <p className="text-xs text-slate-500 leading-relaxed mb-1">
            To ensure your letter is authentic and avoids empty clichés, the Ghostwriter gathers these 5 essential pieces before generating your draft:
          </p>

          {slots.map((s) => (
            <div
              key={s.num}
              className={`p-3.5 rounded-xl border transition-all ${
                s.filled
                  ? "bg-emerald-50/40 border-emerald-200"
                  : "bg-slate-50/60 border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start space-x-2.5">
                  <div className="mt-0.5 shrink-0">
                    {s.filled ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>

                {!s.filled && (
                  <button
                    onClick={() => {
                      onQuickFill(s.sample);
                      onClose();
                    }}
                    disabled={disabled}
                    className="shrink-0 px-2 py-1 text-[11px] font-semibold text-amber-800 bg-amber-100/70 hover:bg-amber-200/70 rounded-md transition-colors"
                  >
                    Fill this
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Batch Fill */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => {
              const fullStory = `Dear Ghostwriter, here are all the details:
1. What happened: Last weekend during my apartment move, I lost my temper when the movers were late. I slammed kitchen cabinet doors, raised my voice, and took my frustration out on my dad who drove 3 hours to help.
2. What I want to thank him for: He lifted heavy furniture in the heat all day without complaint, and even bought me a new toolbox.
3. Dad's personality: He is quiet, reserved, very practical, and dislikes dramatic over-sentimentality.
4. Preferred length & formality: Medium length (~300 words), heartfelt, sincere, respectful and gentle.
5. How I address him: I call him 'Dad'.
Please help me write the draft with 2 tone options so I can clear my head before calling him this Friday!`;
              onQuickFill(fullStory);
              onClose();
            }}
            disabled={disabled}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Fill All 5 Details (Generate Drafts)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
