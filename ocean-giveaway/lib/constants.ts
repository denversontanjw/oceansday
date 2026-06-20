// Centralised constants for the giveaway table.
// The table name contains an apostrophe and spaces (as created in Supabase),
// so it must always be referenced through this constant rather than typed
// inline, to avoid typos/quoting mistakes scattered across the codebase.
export const GIVEAWAY_TABLE = "Ocean's Day Giveaway Table";

export const EMAIL_DOMAIN = "@acra.gov.sg";

export type Participant = {
  id: number;
  email: string;
  gift: string | null;
  collected: boolean | null;
  collected_at: string | null;
};
