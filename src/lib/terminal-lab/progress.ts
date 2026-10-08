import type { TerminalLabProgress } from "@/types/terminal-lab";

const STORAGE_PREFIX = "sysadmin-academy:terminal-lab-progress:";

function storageKey(labId: string): string {
  return `${STORAGE_PREFIX}${labId}`;
}

function isTerminalLabProgress(
  value: unknown,
  expectedLabId: string,
): value is TerminalLabProgress {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    record.labId === expectedLabId &&
    Number.isInteger(record.currentStepIndex) &&
    (record.currentStepIndex as number) >= 0 &&
    typeof record.completed === "boolean" &&
    typeof record.updatedAt === "string"
  );
}

export function saveLabProgress(progress: TerminalLabProgress): void {
  try {
    localStorage.setItem(storageKey(progress.labId), JSON.stringify(progress));
  } catch {
    // localStorage unavailable (quota, private browsing) — nothing to persist to
  }
}

// Caches the parsed record per lab, keyed by the raw stored string, so repeated
// reads of an unchanged value return the same object reference. Without this,
// useSyncExternalStore (which calls loadLabProgress as its getSnapshot) sees a
// "new" value on every render and loops — see platform-shell's lib/progress/storage.ts.
const parsedCache = new Map<string, { raw: string; value: TerminalLabProgress }>();

export function loadLabProgress(labId: string): TerminalLabProgress | null {
  try {
    const raw = localStorage.getItem(storageKey(labId));
    if (raw === null) return null;

    const cached = parsedCache.get(labId);
    if (cached && cached.raw === raw) return cached.value;

    const parsed = JSON.parse(raw);
    if (!isTerminalLabProgress(parsed, labId)) return null;

    parsedCache.set(labId, { raw, value: parsed });
    return parsed;
  } catch {
    return null;
  }
}

export function clearLabProgress(labId: string): void {
  try {
    localStorage.removeItem(storageKey(labId));
  } catch {
    // ignore
  }
}
