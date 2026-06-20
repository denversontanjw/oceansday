import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { GIVEAWAY_TABLE, EMAIL_DOMAIN, type Participant } from "@/lib/constants";
import { validatePrefix, escapeForIlikeExactMatch, INVALID_FORMAT_MESSAGE } from "@/lib/validate";

export const dynamic = "force-dynamic";

type RedeemResponse =
  | { status: "success"; gift: string }
  | { status: "already_collected" }
  | { status: "not_found" }
  | { status: "invalid"; message: string }
  | { status: "error"; message: string };

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<RedeemResponse>(
      { status: "invalid", message: INVALID_FORMAT_MESSAGE },
      { status: 400 }
    );
  }

  const rawPrefix = typeof body === "object" && body !== null && "prefix" in body ? (body as { prefix: unknown }).prefix : "";

  if (typeof rawPrefix !== "string") {
    return NextResponse.json<RedeemResponse>(
      { status: "invalid", message: INVALID_FORMAT_MESSAGE },
      { status: 400 }
    );
  }

  const validation = validatePrefix(rawPrefix);
  if (!validation.valid) {
    return NextResponse.json<RedeemResponse>({ status: "invalid", message: validation.error }, { status: 400 });
  }

  const email = `${validation.prefix}${EMAIL_DOMAIN}`;
  const escapedEmail = escapeForIlikeExactMatch(email);

  try {
    // Atomic claim: only succeeds if a row matches the email AND it has not
    // already been collected. The WHERE clause (translated by PostgREST into
    // a single SQL UPDATE) makes this safe even if two requests for the same
    // email arrive at the same instant.
    const { data: claimed, error: updateError } = await supabaseAdmin
      .from(GIVEAWAY_TABLE)
      .update({ collected: true, collected_at: new Date().toISOString() })
      .ilike("email", escapedEmail)
      .or("collected.is.null,collected.eq.false")
      .select("id, gift")
      .limit(1);

    if (updateError) {
      console.error("Redeem update error:", updateError.message);
      return NextResponse.json<RedeemResponse>(
        { status: "error", message: "System temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }

    if (claimed && claimed.length > 0) {
      const gift = (claimed[0] as Pick<Participant, "id" | "gift">).gift ?? "Surprise gift";
      return NextResponse.json<RedeemResponse>({ status: "success", gift });
    }

    // The update matched nothing. Disambiguate: not found vs already collected.
    const { data: existing, error: lookupError } = await supabaseAdmin
      .from(GIVEAWAY_TABLE)
      .select("id, collected")
      .ilike("email", escapedEmail)
      .limit(1);

    if (lookupError) {
      console.error("Redeem lookup error:", lookupError.message);
      return NextResponse.json<RedeemResponse>(
        { status: "error", message: "System temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }

    if (!existing || existing.length === 0) {
      return NextResponse.json<RedeemResponse>({ status: "not_found" });
    }

    return NextResponse.json<RedeemResponse>({ status: "already_collected" });
  } catch (err) {
    console.error("Redeem unexpected error:", err);
    return NextResponse.json<RedeemResponse>(
      { status: "error", message: "System temporarily unavailable. Please try again." },
      { status: 503 }
    );
  }
}
