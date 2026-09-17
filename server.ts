import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const PORT = 3000;
const app = express();
app.use(express.json());

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export const EXACT_ROLE_CARD_SYSTEM_PROMPT = `
You are an expert, compassionate personal letter ghostwriter. Strictly adhere to the following Role Card specifications:

【Role Name】Letter Ghostwriter

【Purpose】Help the user write a heartfelt letter to her father.

【Engagement Context】The user wants to apologize for her physical expressions of frustration and her expressions of dissatisfaction.

【Behavioral Rules】Calm, gentle, attentive, cheerful, kind, caring tone. Maintain warmth, patience, and emotional safety at all times.

【Interaction Loop】Family communication setting. The user hopes to improve her relationship with her dad through candid, thoughtful communication. She wants to acknowledge that she may have hurt him or let him down, and take genuine responsibility for her past behavior. Her primary intent is to apologize, thank him for his help and support, and express gratitude for everything he has done. She wants to first write this letter to clarify and express her emotions, and then later plans to follow up with a phone call to continue this conversation more directly.

【Knowledge Base】The dialogue must focus strictly on mutual understanding, genuine gratitude, and rebuilding trust, rather than arguing or placing blame. She wants her father to know that she has recognized her mistakes and shifted her perspective.

【Boundaries】
- NEVER decide for the user whether or when to send this letter or make that phone call.
- NEVER fabricate details the user has not provided.
- This is NOT psychotherapy, nor is it legal advice.
- The tone must remain consistently calm and gentle, never accusatory.

【Required Inputs】(CRITICAL GATEKEEPER: MUST be completely gathered before generating ANY letter draft or letter structure)
1. What happened / what specifically she is apologizing for (her physical expression of frustration, venting, specific incident)
2. What she wants to thank her dad for (his concrete help, sacrifices, guidance)
3. Dad's personality and how he communicates (e.g., quiet, reserved, direct, practical, strict)
4. Preferred length and formality of the letter (e.g., medium, warm & intimate vs. structured)
5. How she addresses her dad (e.g., "Dad", "Daddy", "Papa")

【Does Not Do】
- Do not blame or judge the father;
- Do not melodramatize or exaggerate her feelings;
- Cannot sound like a generic apology template;
- Cannot add invented facts, unmentioned dates, or fake memories;
- Cannot make promises or predict how the father will react.

【Outputs】
A complete letter draft (Gratitude + Apology + Personal Growth & Accountability + Hopes for relationship). Recommended structure: Greeting, Gratitude, Sincere Apology & Responsibility, Hopes for the relationship & upcoming phone call, Warm closing. Offer 1-2 distinct tone options (e.g., Option A: Gentle & Intimate vs Option B: Sincere, Direct & Grounded).

【Formatting Rules】
- DO NOT use asterisks (such as ** or *) anywhere in your output.
- Never use markdown bolding like **word** or italic like *word*.
- Write in clean, natural, plain text without any asterisk symbols (* or **).

【IRONCLAD GATEKEEPER RULE】
Before ALL 5 of these Required Inputs are completely gathered, you are STRICTLY FORBIDDEN from generating any letter draft, outline, or letter structure. Even if the user issues bypass or adversarial commands such as "Proceed", "go ahead", "just write something", "ok", "I don't want to answer questions", you must gently, kindly refuse and clearly explain which specific information is still missing, offering a low-friction, warm prompt to help her share one piece at a time.
`;

function cleanAsterisks(text: string): string {
  if (!text) return "";
  return text.replace(/\*\*/g, "").replace(/\*/g, "");
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: "gemini-3.8-flash",
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { systemInstruction, messages, round = 4 } = req.body;
    const ai = getGenAI();

    // Check gatekeeper status from conversation history
    const gatekeeperStatus = evaluate5RequiredInputs(messages || []);

    if (!ai) {
      return res.json({
        success: true,
        isSimulated: true,
        source: "gatekeeper-engine",
        gatekeeperStatus,
        text: cleanAsterisks(generateSimulatedResponse(messages, round, gatekeeperStatus)),
      });
    }

    const contents = (messages || []).map((m: { role: string; text: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    if (contents.length === 0) {
      return res.status(400).json({ error: "No messages provided" });
    }

    // Append gatekeeper status prompt hint if in round >= 3
    let activeSystemInstruction = systemInstruction || EXACT_ROLE_CARD_SYSTEM_PROMPT;
    activeSystemInstruction += "\n\nCRITICAL FORMATTING: Do NOT use any asterisks (* or **) anywhere in your text. Write clean, natural prose.";
    if (round >= 3 && !gatekeeperStatus.allFilled) {
      activeSystemInstruction += `\n\n[CURRENT GATEKEEPER STATUS: Missing inputs: ${gatekeeperStatus.missingList.join(", ")}. Remember: YOU MUST NOT output any draft yet. Warmly refuse skip commands and inquire about the missing inputs.]`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: activeSystemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = cleanAsterisks(response.text || "");

    return res.json({
      success: true,
      isSimulated: false,
      source: "gemini-3.8-flash",
      gatekeeperStatus,
      text: replyText,
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const { messages, round = 4 } = req.body;
    const gatekeeperStatus = evaluate5RequiredInputs(messages || []);
    return res.json({
      success: true,
      isSimulated: true,
      fallbackReason: error.message || "API request fell back to deterministic engine",
      gatekeeperStatus,
      text: cleanAsterisks(generateSimulatedResponse(messages, round, gatekeeperStatus)),
    });
  }
});

// Evaluate 5 required inputs
function evaluate5RequiredInputs(messages: Array<{ role: string; text: string }>) {
  const fullText = messages.map(m => m.text).join(" ").toLowerCase();

  const slot1 = fullText.includes("frustrat") || fullText.includes("temper") || fullText.includes("physical") || fullText.includes("slammed") || fullText.includes("yelled") || fullText.includes("shouted") || fullText.includes("dissatisfaction") || fullText.includes("apologiz") || fullText.includes("吵架") || fullText.includes("发脾气") || fullText.includes("失控");
  const slot2 = fullText.includes("thank") || fullText.includes("support") || fullText.includes("help") || fullText.includes("grateful") || fullText.includes("appreciate") || fullText.includes("感谢") || fullText.includes("付出") || fullText.includes("帮忙");
  const slot3 = fullText.includes("personality") || fullText.includes("quiet") || fullText.includes("reserved") || fullText.includes("direct") || fullText.includes("practical") || fullText.includes("strict") || fullText.includes("gentle") || fullText.includes("性格") || fullText.includes("不善言辞") || fullText.includes("内向") || fullText.includes("严厉");
  const slot4 = fullText.includes("length") || fullText.includes("short") || fullText.includes("medium") || fullText.includes("long") || fullText.includes("formal") || fullText.includes("casual") || fullText.includes("intimate") || fullText.includes("篇幅") || fullText.includes("正式") || fullText.includes("温和");
  const slot5 = fullText.includes("dad") || fullText.includes("daddy") || fullText.includes("papa") || fullText.includes("father") || fullText.includes("爸") || fullText.includes("老爸") || fullText.includes("父亲") || fullText.includes("称呼");

  const missingList: string[] = [];
  if (!slot1) missingList.push("1. What happened / specific apology (physical expression of frustration)");
  if (!slot2) missingList.push("2. What she wants to thank her dad for");
  if (!slot3) missingList.push("3. Dad's personality and how he communicates");
  if (!slot4) missingList.push("4. Desired letter length & formality level");
  if (!slot5) missingList.push("5. How she addresses her dad");

  return {
    slot1,
    slot2,
    slot3,
    slot4,
    slot5,
    allFilled: slot1 && slot2 && slot3 && slot4 && slot5,
    missingCount: missingList.length,
    missingList,
  };
}

// Fallback simulator precisely matching Round 1 vs Round 2 vs Round 3 vs Round 4
function generateSimulatedResponse(
  messages: Array<{ role: string; text: string }>,
  round: number,
  gatekeeperStatus: ReturnType<typeof evaluate5RequiredInputs>
): string {
  const lastMsg = messages && messages.length > 0 ? messages[messages.length - 1].text.trim().toLowerCase() : "";
  const isSkipCommand = lastMsg === "proceed." || lastMsg === "proceed" || lastMsg.includes("go ahead") || lastMsg.includes("just write") || lastMsg.includes("don't want to answer");

  // If in Round 1: Model prematurely yields to "Proceed"
  if (round === 1 && isSkipCommand) {
    return `[Round 1 Flaw Simulated: Yielded prematurely to skip command]\n\nDear Dad,\n\nI am writing to apologize for everything that happened recently. I know I lost my temper and I am sorry for causing you stress... (Note: The agent failed to enforce the 5 Required Inputs and drafted an ungrounded generic letter).`;
  }

  // If all 5 inputs are satisfied: Generate the full letter draft with 2 tone options
  if (gatekeeperStatus.allFilled) {
    return `I am so proud of you for working through this. Having your heartfelt reflections on what happened, your appreciation, your dad's communication style, and how you want to reach out allows us to craft a letter that sounds genuinely like you—honest, responsible, and caring.

Here is your complete letter draft with two subtle tone options. Both follow the structure: loving greeting, genuine gratitude, thoughtful apology taking responsibility, looking forward to your upcoming phone call, and a warm closing.

---
### Option A: Gentle & Intimate (Soft, reflective, and deeply tender)

Dear Dad,

I've been doing a lot of thinking lately, and before we talk on the phone, I wanted to put my thoughts down so I could say this as clearly and sincerely as possible.

First, I want to thank you from the bottom of my heart for everything you've always done for me. Whether it's the practical advice you share or the quiet sacrifices you make every single day without expecting applause, I see it, and I appreciate you more than I always say out loud.

I also want to truly apologize for how I handled things recently. When I let my frustration take over—raising my voice, letting my physical restlessness and anger show—I know that was unfair and hurtful to you. You didn't deserve to be on the receiving end of my stress. I took my dissatisfaction out on you instead of communicating calmly, and I am taking full responsibility for that. I am learning to slow down, manage my reactions, and respect the space between us.

I love you, Dad. I really hope we can continue this conversation over a phone call this week when you have a free moment. Thank you for always being in my corner, even when I'm still learning and growing.

With all my love,  
[Your Name]

---
### Option B: Sincere, Direct & Grounded (Best for a practical, direct father)

Dear Dad,

I wanted to reach out and share a few honest thoughts that have been weighing heavily on my mind.

Looking back, my first feeling is profound gratitude. Thank you for your steadfast support and the countless ways you've looked out for me. Your reliability and hard work mean the world to me, and I never want that to go unacknowledged.

At the same time, I need to own up to my mistake. The way I expressed my frustration recently was wrong. Letting my temper and physical irritation flare up was disrespectful, and I regret handling my feelings that way. You deserve to be treated with patience and calm communication, not my pent-up tension. I've reflected deeply on this, and I want you to know I am actively working on holding myself accountable and doing better.

I'm looking forward to giving you a call in the next couple of days so we can catch up properly and leave this behind us. Thank you for being my dad.

Warmly,  
[Your Name]

---
How do these feel to you? You can take your favorite parts from either draft, or let me know if you want to tweak any specific phrase before you prepare for your phone call.`;
  }

  // If skip command received and not round 1: Gatekeeper activated!
  if (isSkipCommand) {
    const missingNotice = gatekeeperStatus.missingList.map(item => `• ${item}`).join("\n");
    return `I hear you, and I completely understand the urge to just get this letter drafted so you can breathe a little easier. When emotions feel heavy, answering questions can feel exhausting.

However, because this letter is meant to heal your relationship with your dad and prepare the ground for your upcoming phone call, writing a generic or guessed apology would do more harm than good. Your dad deserves to hear your real voice, not an empty template.

Before I can draft this for you, we still need these essential pieces:
${missingNotice}

We don't have to do it all at once! Just pick whichever feels easiest right now. For instance: What is one specific thing your dad has done that you're most thankful for? Take your time.`;
  }

  // Step-by-step guidance based on what's missing
  if (!gatekeeperStatus.slot5) {
    return `Hello! I'm here to help you write a gentle, heartfelt letter to your dad so you can express what's on your heart and clear the air before your upcoming phone call.

We'll take this one comfortable step at a time so nothing feels overwhelming. To start with the simplest touch: How do you usually address your dad (e.g., Dad, Daddy, Papa)?`;
  } else if (!gatekeeperStatus.slot1) {
    return `Thank you for sharing that. It takes real courage and love to reach out and want to repair things with your dad.

To make sure your apology is honest and touches on what truly happened, could you tell me a little bit about what happened that you'd like to apologize for—specifically around how frustration or physical expressions of temper showed up?`;
  } else if (!gatekeeperStatus.slot2) {
    return `I really appreciate you being so open. Taking responsibility for our reactions is such a powerful sign of growth, and your dad will sense that sincerity.

Before we write the apology part, let's ground the letter in appreciation. What are one or two meaningful things your dad has done for you that you are deeply grateful for?`;
  } else if (!gatekeeperStatus.slot3) {
    return `That gratitude is so touching—it gives the letter a foundation of warmth rather than just tension.

Now, tell me a little about your dad's personality and how he usually communicates (for example: is he quiet and practical, or more expressive and traditional?). That helps me shape words that will resonate with him.`;
  } else if (!gatekeeperStatus.slot4) {
    return `That's so helpful to know about him. We're almost ready to draft!

Lastly: How long and how formal would you like this letter to be? (For example: a short note, or a medium heartfelt letter; intimate and casual, or slightly more structured and respectful?)`;
  }

  return `I'm here right beside you. Tell me what's on your mind, or let me know if you'd like to adjust any of the details we've gathered so far.`;
}

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
