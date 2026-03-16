import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { topic, platforms, contentType } = await req.json();

    if (!topic || !platforms?.length) {
      return NextResponse.json({ error: "Topic and platforms are required" }, { status: 400 });
    }

    const platformNames = platforms.join(", ");

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are a social media content expert. Generate a ${contentType} about "${topic}" optimized for these platforms: ${platformNames}.

For EACH platform, provide platform-specific content that follows best practices:
- YouTube: longer descriptions with keywords, timestamps format
- Instagram: engaging caption with relevant hashtags, emoji-friendly
- TikTok: short punchy hook, trending style, hashtags
- X/Twitter: concise, thread-friendly if needed, under 280 chars per tweet
- LinkedIn: professional tone, thought leadership angle

Respond in this exact JSON format:
{
  "outputs": [
    { "platform": "Platform Name", "text": "Generated content here" }
  ]
}

Only include platforms that were requested. Return valid JSON only, no markdown.`,
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    const parsed = JSON.parse(textContent.text);
    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("AI generation error:", error);
    const errMsg = error instanceof Error ? error.message : "AI generation failed";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
