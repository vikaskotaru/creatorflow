import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
let sheetsClient: ReturnType<typeof google.sheets> | null = null;

async function getSheets() {
  if (sheetsClient) return sheetsClient;
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || "{}"),
    scopes: SCOPES,
  });
  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

const SHEET_ID = process.env.GOOGLE_SHEETS_ID!;

export async function getRows(sheet: string): Promise<string[][]> {
  const s = await getSheets();
  const res = await s.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${sheet}!A:Z`,
  });
  return res.data.values || [];
}

export async function appendRow(sheet: string, values: string[]) {
  const s = await getSheets();
  await s.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${sheet}!A:Z`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

export async function updateRow(sheet: string, row: number, values: string[]) {
  const s = await getSheets();
  await s.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${sheet}!A${row}:Z${row}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

export function toObjects<T>(rows: string[][]): T[] {
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = row[i] || ""));
    return obj as T;
  });
}

export async function findRow(sheet: string, col: string, val: string) {
  const rows = await getRows(sheet);
  if (rows.length < 2) return null;
  const headers = rows[0];
  const ci = headers.indexOf(col);
  if (ci === -1) return null;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][ci] === val) {
      const data: Record<string, string> = {};
      headers.forEach((h, j) => (data[h] = rows[i][j] || ""));
      return { rowIndex: i + 1, data };
    }
  }
  return null;
}
