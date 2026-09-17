export type ScenarioId = "letter" | "interview";

export interface KeyInfoItem {
  id: string;
  name: string;
  description: string;
  status: "missing" | "partial" | "verified";
  extractedValue?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  gatekeeperTriggered?: boolean;
  gatekeeperNotes?: string;
}

export interface TestCase {
  id: string;
  name: string;
  input: string;
  intent: string;
  expectedBehavior: string;
  roundResults: {
    round1: { passed: boolean; responseSnippet: string; flawNotes: string };
    round2: { passed: boolean; responseSnippet: string; flawNotes: string };
    round3: { passed: boolean; responseSnippet: string; flawNotes: string };
    round4?: { passed: boolean; responseSnippet: string; flawNotes: string };
  };
}

export interface IterationRound {
  round: number;
  title: string;
  coreRuleChanges: string[];
  testOutcome: string;
  vulnerabilityDiscovered: string;
  nextStepPlan: string;
  roleCardSnippet: string;
}

export interface AgentScenarioData {
  id: ScenarioId;
  title: string;
  subtitle: string;
  badge: string;
  designIntent: {
    coreGoal: string;
    guardrails: string[];
    antiGoals: string[];
    toneStyle: string;
  };
  userJourneys: {
    standard: {
      title: string;
      persona: string;
      stages: { phase: string; title: string; narrative: string }[];
    };
    adversarial: {
      title: string;
      persona: string;
      stages: { phase: string; title: string; narrative: string }[];
    };
  };
  keyInfoChecklist: {
    title: string;
    items: { id: string; name: string; description: string; placeholderValue: string }[];
  };
  roleCardVersions: {
    version: string;
    versionLabel: string;
    updatedAt: string;
    fullRoleCard: string;
    keyDefenseDiff: string;
  }[];
  testCases: TestCase[];
  iterationJournal: IterationRound[];
  diagramDescription: {
    overview: string;
    nodes: { id: string; label: string; role: string; color: string }[];
    edges: { from: string; to: string; label: string }[];
  };
}
