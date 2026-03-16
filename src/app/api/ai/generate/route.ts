import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { getRows, appendRow, toObjects, findRow, updateRow } from "@/lib/sheets";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface UserCredits { userId: string; credits: string; plan: string; updatedAt: string; }
const CREDITS_SHEET = "user_credits";
const FREE_CREDITS = 10;

async function deductCredit(userId: string): Promise<{ ok: boolean; credits: number }> {
  try {
    const rows = await getRows(CREDITS_SHEET);
    const all = toObjects<UserCredits>(rows);
    const userRow = await findRow(CREDITS_SHEET, "userId", userId);
    let credits = FREE_CREDITS;
    let plan = "free";

    if (userRow) {
      credits = parseInt(userRow.data.credits) || 0;
      plan = userRow.data.plan || "free";
    }

    if (plan !== "free") return { ok: true, credits }; // paid plans unlimited

    if (credits <= 0) return { ok: false, credits: 0 };

    const newCredits = credits - 1;
    const row = [userId, String(newCredits), plan, new Date().toISOString()];
    if (userRow) {
      await updateRow(CREDITS_SHEET, userRow.rowIndex, row);
    } else {
      await appendRow(CREDITS_SHEET, row);
    }
    return { ok: true, credits: newCredits };
  } catch {
    return { ok: true, credits: FREE_CREDITS }; // fail open
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { topic, platforms, contentType, tone } = await req.json();

    if (!topic || !platforms?.length) {
      return NextResponse.json({ error: "Topic and platforms are required" }, { status: 400 });
    }

    // Deduct credit
    const creditResult = await deductCredit(userId);
    if (!creditResult.ok) {
      return NextResponse.json({ error: "No credits remaining. Please upgrade to Pro for unlimited generations.", credits: 0 }, { status: 402 });
    }

    const platformNames = (platforms as string[]).map(p =>
      p === "youtube" ? "YouTube" :
      p === "instagram" ? "Instagram" :
      p === "tiktok" ? "TikTok" :
      p === "twitter" ? "X/Twitter" :
      p === "linkedin" ? "LinkedIn" : p
    ).join(", ");

    const toneStr = tone || "engaging and authentic";

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2500,
      messages: [{
        role: "user",
        content: `You are an expert social media content strategist. Generate high-quality ${contentType} content about "${topic}" optimized for: ${platformNames}.

Tone: ${toneStr}

Platform-specific requirements:
- YouTube: Compelling title + description with SEO keywords, suggested timestamps if applicable
- Instagram: Hook line + caption with emojis + 15-20 relevant hashtags
- TikTok: Viral hook (first 3 seconds) + short punchy script + trending hashtags
- X/Twitter: Thread format or single tweet under 280 chars, punchy and shareable
- LinkedIn: Professional thought leadership angle, story-driven, no hashtag spam

Return ONLY valid JSON in this exact format:
{
  "outputs": [
    { "platform": "Platform Name", "text": "Full generated content here" }
  ]
}`,
      }],
    });

    const textContent = message.content.find(c => c.type === "text");
    if (!textContent || textContent.type !== "text") throw new Error("No AI response");

    let parsed;
    try {
      parsed = JSON.parse(textContent.text);
    } catch {
      const match = textContent.text.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error("Invalid JSON response");
    }

    return NextResponse.json({ ...parsed, creditsRemaining: creditResult.credits });
  } catch (error: unknown) {
    console.error("AI generation error:", error);
    if (error instanceof Error && error.message.includes("402")) {
      return NextResponse.json({ error: "No credits remaining" }, { status: 402 });
    }
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
