import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRows, appendRow, toObjects, findRow, updateRow } from "@/lib/sheets";

interface UserCredits {
  userId: string;
  credits: string;
  plan: string;
  updatedAt: string;
}

const SHEET = "user_credits";
const FREE_CREDITS = 10;

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await getRows(SHEET);
    const all = toObjects<UserCredits>(rows);
    const user = all.find(u => u.userId === userId);

    if (!user) {
      // First time — create with 10 free credits
      await appendRow(SHEET, [userId, String(FREE_CREDITS), "free", new Date().toISOString()]);
      return NextResponse.json({ credits: FREE_CREDITS, plan: "free" });
    }

    return NextResponse.json({ credits: parseInt(user.credits) || 0, plan: user.plan || "free" });
  } catch {
    return NextResponse.json({ credits: FREE_CREDITS, plan: "free" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { action } = await req.json(); // "use" or "add"
    const rows = await getRows(SHEET);
    const all = toObjects<UserCredits>(rows);
    const userRow = await findRow(SHEET, "userId", userId);

    let currentCredits = FREE_CREDITS;
    let plan = "free";

    if (userRow) {
      currentCredits = parseInt(userRow.data.credits) || 0;
      plan = userRow.data.plan || "free";
    }

    if (action === "use") {
      if (currentCredits <= 0) {
        return NextResponse.json({ error: "No credits remaining", credits: 0, plan }, { status: 402 });
      }
      const newCredits = currentCredits - 1;
      const row = [userId, String(newCredits), plan, new Date().toISOString()];
      if (userRow) {
        await updateRow(SHEET, userRow.rowIndex, row);
      } else {
        await appendRow(SHEET, row);
      }
      return NextResponse.json({ credits: newCredits, plan });
    }

    return NextResponse.json({ credits: currentCredits, plan });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update credits" }, { status: 500 });
  }
}
