import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { GIVEAWAY_TABLE } from "@/lib/constants";

export const dynamic = "force-dynamic";

type EditBody = {
  gift?: string | null;
  collected?: boolean | null;
  collected_at?: string | null;
};

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid participant id." }, { status: 400 });
  }

  let body: EditBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const update: EditBody = {};
  if ("gift" in body) update.gift = body.gift;
  if ("collected" in body) update.collected = body.collected;
  if ("collected_at" in body) update.collected_at = body.collected_at;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from(GIVEAWAY_TABLE)
    .update(update)
    .eq("id", id)
    .select("id, email, gift, collected, collected_at")
    .limit(1);

  if (error) {
    return NextResponse.json(
      { error: "System temporarily unavailable. Please try again." },
      { status: 503 }
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Participant not found." }, { status: 404 });
  }

  return NextResponse.json({ row: data[0] });
}
