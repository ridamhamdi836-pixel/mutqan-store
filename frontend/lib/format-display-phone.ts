/** Display KSA mobile as 05xxxxxxxx for thank-you summary */
export function formatDisplayPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("966") && digits.length >= 12) {
    return `0${digits.slice(3)}`;
  }
  if (digits.startsWith("0")) return digits;
  if (digits.length === 9) return `0${digits}`;
  return phone.trim();
}
