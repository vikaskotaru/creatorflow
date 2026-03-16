import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRows, appendRow, toObjects, findRow, updateRow } from "@/lib/sheets";

export interface Content {
  id: string;
  platform: string;
  title: string;
  status: string;
  scheduledAt: string;
  publishedAt: string;
  views: string;
  engagement: string;
  body?: string;
}

const SHEET = "content";

export async function GET() {
  try {
    const rows = await getRows(SHEET);
    const items = toObjects<Content>(rows).filter(c => c.id);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Failed to fetch content:", error);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const row = [
      id,
      body.platform || "",
      body.title || "",
      body.status || "draft",
      body.scheduledAt || "",
      body.status === "published" ? now : "",
      "0",
      "0",
      body.body || "",
    ];
    await appendRow(SHEET, row);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Failed to save content:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await req.json();
    const existing = await findRow(SHEET, "id", id);
    if (existing) {
      await updateRow(SHEET, existing.rowIndex, ["", "", "", "", "", "", "", "", ""]);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete content:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
