import type { ProgressRecord } from "@/types/curriculum";

const STORAGE_PREFIX = "sysadmin-academy:progress:";

function storageKey(lessonId: string): string {
  return `${STORAGE_PREFIX}${lessonId}`;
}

function isProgressRecord(value: unknown): value is ProgressRecord {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.lessonId === "string" &&
    typeof record.completed === "boolean" &&
    typeof record.score === "number" &&
    Array.isArray(record.questions) &&
    typeof record.updatedAt === "string"
  );
}

export function saveProgress(record: ProgressRecord): void {
  try {
    localStorage.setItem(storageKey(record.lessonId), JSON.stringify(record));
  } catch {
    // localStorage unavailable (quota, private browsing) — nothing to persist to
  }
}

// Caches the parsed record per lesson, keyed by the raw stored string, so repeated
// reads of an unchanged value return the same object reference. Without this,
// useSyncExternalStore (which calls loadProgress as its getSnapshot) sees a "new"
// value on every render and loops.
const parsedCache = new Map<string, { raw: string; value: ProgressRecord }>();

export function loadProgress(lessonId: string): ProgressRecord | null {
  try {
    const raw = localStorage.getItem(storageKey(lessonId));
    if (raw === null) return null;

    const cached = parsedCache.get(lessonId);
    if (cached && cached.raw === raw) return cached.value;

    const parsed = JSON.parse(raw);
    if (!isProgressRecord(parsed)) return null;

    parsedCache.set(lessonId, { raw, value: parsed });
    return parsed;
  } catch {
    return null;
  }
}

export function clearProgress(lessonId: string): void {
  try {
    localStorage.removeItem(storageKey(lessonId));
  } catch {
    // ignore
  }
}
