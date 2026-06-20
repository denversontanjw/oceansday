import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { GIVEAWAY_TABLE } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Pulls every row's `collected` value and counts directly in code, rather
// than relying on PostgREST's count-header mechanism. Slower at very large
// scale, but for a few thousand rows it's instant and removes any doubt
// about what's actually being counted.
export async function GET() {
  const PAGE_SIZE = 1000;
  let from = 0;
  let total = 0;
  let collected = 0;

  while (true) {
    const { data, error } = await supabaseAdmin
      .from(GIVEAWAY_TABLE)
      .select("collected")
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      return NextResponse.json(
        { error: "System temporarily unavailable. Please try again." },
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
    }
    if (!data || data.length === 0) break;

    total += data.length;
    collected += data.filter((row) => row.collected === true).length;

    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return NextResponse.json(
    { total, collected },
    { headers: { "Cache-Control": "no-store" } }
  );
}
