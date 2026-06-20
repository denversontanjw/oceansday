import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { GIVEAWAY_TABLE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(200, Math.max(1, parseInt(searchParams.get("pageSize") ?? "50", 10) || 50));

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from(GIVEAWAY_TABLE)
    .select("id, email, gift, collected, collected_at", { count: "exact" })
    .order("email", { ascending: true })
    .range(from, to);

  if (q.length > 0) {
    // Substring search by email prefix or full email. This is intentionally
    // a "contains" search (admin convenience), unlike the strict exact-match
    // lookup used in the public redemption flow.
    query = query.ilike("email", `%${q.toLowerCase()}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json(
      { error: "System temporarily unavailable. Please try again." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { rows: data ?? [], total: count ?? 0, page, pageSize },
    { headers: { "Cache-Control": "no-store" } }
  );
}
