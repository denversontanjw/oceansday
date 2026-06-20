import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { GIVEAWAY_TABLE } from "@/lib/constants";

export const dynamic = "force-dynamic";

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const PAGE_SIZE = 1000;
  let from = 0;
  const rows: Record<string, unknown>[] = [];

  // Page through the table rather than a single unbounded select, so this
  // keeps working cleanly even as the participant list grows.
  while (true) {
    const { data, error } = await supabaseAdmin
      .from(GIVEAWAY_TABLE)
      .select("id, email, gift, collected, collected_at")
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      return NextResponse.json(
        { error: "System temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }
    if (!data || data.length === 0) break;
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  const header = ["id", "email", "gift", "collected", "collected_at"];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push(header.map((key) => csvEscape(row[key])).join(","));
  }
  const csv = lines.join("\n");

  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="oceans-day-giveaway-${timestamp}.csv"`,
    },
  });
}
