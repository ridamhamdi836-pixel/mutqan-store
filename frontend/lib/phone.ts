const MIN_PHONE_DIGITS = 7;
const MAX_PHONE_DIGITS = 15;

function phoneDigits(raw: string): string {
  return raw.trim().replace(/\s|-/g, "").replace(/\D/g, "");
}

/** Accepts any phone with 7–15 digits (mobile, landline, +966, 05, 01, etc.) */
export function validatePhone(raw: string): boolean {
  const digits = phoneDigits(raw);
  return digits.length >= MIN_PHONE_DIGITS && digits.length <= MAX_PHONE_DIGITS;
}

/** @deprecated alias — use validatePhone */
export function validateSaudiPhone(raw: string): boolean {
  return validatePhone(raw);
}

export function normalizePhone(raw: string): { e164: string; local: string } {
  const local = raw.trim().replace(/\s|-/g, "");
  const digits = phoneDigits(raw);

  let e164: string;
  if (local.startsWith("+")) {
    e164 = `+${digits}`;
  } else if (digits.startsWith("966")) {
    e164 = `+${digits}`;
  } else if (digits.startsWith("0")) {
    e164 = `+966${digits.slice(1)}`;
  } else {
    e164 = `+966${digits}`;
  }

  return { e164, local: local || digits };
}

export function normalizeSaudiPhone(raw: string): string {
  return normalizePhone(raw).e164;
}
