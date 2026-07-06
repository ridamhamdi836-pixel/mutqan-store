/** Western digits (0–9) for all storefront locales — never Arabic-Indic numerals. */
export function formatWesternNumber(value: number): string {
  return value.toLocaleString("en-US");
}
