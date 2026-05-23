const SAUDI_MOBILE_REGEX = /^(\+?966|0)?5\d{8}$/;

export function validateSaudiPhone(raw: string): boolean {
  const phone = raw.trim().replace(/\s|-/g, "");
  return SAUDI_MOBILE_REGEX.test(phone);
}

export function normalizeSaudiPhone(raw: string): string {
  const phone = raw.trim().replace(/\s|-/g, "");
  const digits = phone.replace(/\D/g, "");

  let local: string;
  if (digits.startsWith("966")) {
    local = digits.slice(3);
  } else if (digits.startsWith("0")) {
    local = digits.slice(1);
  } else {
    local = digits;
  }
  return `+966${local}`;
}
