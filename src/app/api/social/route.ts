import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRows, appendRow, toObjects, findRow, updateRow } from "@/lib/sheets";

export interface SocialProfile {
  userId: string;
  platform: string;
  handle: string;
  profileUrl: string;
  followers: string;
  following: string;
  posts: string;
  engagementRate: string;
  avatar: string;
  connectedAt: string;
  lastSynced: string;
}

const SHEET = "social_profiles";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await getRows(SHEET);
    const all = toObjects<SocialProfile>(rows);
    const profiles = all.filter(p => p.userId === userId);
    return NextResponse.json({ profiles });
  } catch {
    return NextResponse.json({ profiles: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { platform, handle, profileUrl, followers, following, posts, engagementRate, avatar } = body;

    const existing = await findRow(SHEET, "handle", handle);
    const now = new Date().toISOString();
    const row = [userId, platform, handle, profileUrl || "", followers || "0", following || "0", posts || "0", engagementRate || "0", avatar || "", now, now];

    if (existing) {
      await updateRow(SHEET, existing.rowIndex, row);
    } else {
      await appendRow(SHEET, row);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { handle } = await req.json();
    // Mark as deleted by clearing data — Google Sheets doesn't support row deletion via API easily
    const existing = await findRow(SHEET, "handle", handle);
    if (existing && existing.data.userId === userId) {
      await updateRow(SHEET, existing.rowIndex, ["", "", "", "", "", "", "", "", "", "", ""]);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
