export function formatSAR(amount: number): string {
  return `${amount.toLocaleString("ar-SA")} ريال`;
}

export function formatSARCompact(amount: number): string {
  return `${amount} ر.س`;
}
