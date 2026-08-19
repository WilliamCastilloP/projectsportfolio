type ClassValue = string | number | null | undefined | false;

export function cn(...values: ClassValue[]) {
  return values.filter(Boolean).join(" ");
}

/** "1" -> "01", used for the section counters. */
export function pad(index: number) {
  return String(index).padStart(2, "0");
}
