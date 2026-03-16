import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { getRows, toObjects } from "@/lib/sheets";
import type { Content } from "@/app/api/content/route";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { stats } = await req.json();

    const rows = await getRows("content");
    const all = toObjects<Content>(rows);
    const userContent = all.filter(c => c.id);

    const summary = `
User has ${userContent.length} total content pieces.
Published: ${userContent.filter(c => c.status === "published").length}
Scheduled: ${userContent.filter(c => c.status === "scheduled").length}
Drafts: ${userContent.filter(c => c.status === "draft").length}
Platforms used: ${[...new Set(userContent.map(c => c.platform))].join(", ") || "None yet"}
Total views: ${userContent.reduce((s, c) => s + (parseInt(c.views) || 0), 0)}
Additional stats: ${JSON.stringify(stats || {})}
    `.trim();

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      messages: [{
        role: "user",
        content: `You are a social media growth expert. Based on this creator's data, give 4 specific, actionable insights to improve their content performance.

Creator data:
${summary}

Return JSON only in this format:
{
  "insights": [
    { "title": "Short insight title", "detail": "1-2 sentence actionable recommendation", "type": "tip|warning|opportunity" }
  ]
}`,
      }],
    });

    const text = message.content.find(c => c.type === "text");
    if (!text || text.type !== "text") throw new Error("No response");
    const parsed = JSON.parse(text.text);
    return NextResponse.json(parsed);
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      insights: [
        { title: "Start publishing consistently", detail: "Aim for at least 3 posts per week to build momentum with platform algorithms.", type: "tip" },
        { title: "Diversify your platforms", detail: "Creators on 3+ platforms grow 40% faster than single-platform creators.", type: "opportunity" },
        { title: "Engage within the first hour", detail: "Reply to comments within 60 minutes of posting to boost algorithmic reach by up to 3x.", type: "tip" },
        { title: "Use AI to repurpose content", detail: "Turn one YouTube video into 5 pieces of content: Instagram carousel, TikTok clips, Twitter thread, LinkedIn post, and newsletter.", type: "opportunity" },
      ],
    });
  }
}
