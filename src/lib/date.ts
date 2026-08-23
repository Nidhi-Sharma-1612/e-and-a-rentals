export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function formatDisplayDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Sample booked-out dates for the calendar demo (no live availability
 * backend yet). Fixed offsets from today so the calendar always shows a
 * believable mix of open and blocked dates across the next couple of months.
 */
export function generateSampleUnavailableDates(): Set<string> {
  const offsets = [3, 4, 5, 12, 13, 19, 20, 26, 33, 34, 40, 47, 48, 54, 61];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const set = new Set<string>();
  for (const offset of offsets) {
    const d = new Date(base);
    d.setDate(d.getDate() + offset);
    set.add(toISODate(d));
  }
  return set;
}
