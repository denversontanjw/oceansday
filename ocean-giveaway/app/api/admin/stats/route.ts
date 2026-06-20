import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { GIVEAWAY_TABLE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const { count: total, error: totalError } = await supabaseAdmin
    .from(GIVEAWAY_TABLE)
    .select("*", { count: "exact", head: true });

  const { count: collected, error: collectedError } = await supabaseAdmin
    .from(GIVEAWAY_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("collected", true);

  if (totalError || collectedError) {
    return NextResponse.json(
      { error: "System temporarily unavailable. Please try again." },
      { status: 503 }
    );
  }

  return NextResponse.json({ total: total ?? 0, collected: collected ?? 0 });
}
