/** "1" -> "01", used for the section counters. */
export function pad(index: number) {
  return String(index).padStart(2, "0");
}
