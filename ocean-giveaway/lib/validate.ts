// Allowed: letters, numbers, underscore only. Nothing else.
const PREFIX_PATTERN = /^[a-zA-Z0-9_]+$/;
const MAX_PREFIX_LENGTH = 64;

export const INVALID_FORMAT_MESSAGE =
  "Invalid format. Please use only letters, numbers, or underscore (_).";

export function validatePrefix(rawPrefix: string): { valid: true; prefix: string } | { valid: false; error: string } {
  const prefix = rawPrefix.trim();

  if (prefix.length === 0) {
    return { valid: false, error: "Please enter your email prefix." };
  }
  if (prefix.length > MAX_PREFIX_LENGTH) {
    return { valid: false, error: INVALID_FORMAT_MESSAGE };
  }
  if (!PREFIX_PATTERN.test(prefix)) {
    return { valid: false, error: INVALID_FORMAT_MESSAGE };
  }
  return { valid: true, prefix: prefix.toLowerCase() };
}

// Escapes Postgres LIKE/ILIKE special characters (%, _, \) so that a
// case-insensitive *exact* match can safely be done via ilike without
// underscores in the prefix being misinterpreted as single-character
// wildcards.
export function escapeForIlikeExactMatch(value: string): string {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}
