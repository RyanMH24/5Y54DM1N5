import type { MockConsoleProgress } from "@/types/mock-console";

const STORAGE_PREFIX = "sysadmin-academy:mock-console-progress:";

function storageKey(scenarioId: string): string {
  return `${STORAGE_PREFIX}${scenarioId}`;
}

function isMockConsoleProgress(
  value: unknown,
  expectedScenarioId: string,
): value is MockConsoleProgress {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    record.scenarioId === expectedScenarioId &&
    Number.isInteger(record.currentTaskIndex) &&
    (record.currentTaskIndex as number) >= 0 &&
    typeof record.completed === "boolean" &&
    typeof record.updatedAt === "string"
  );
}

export function saveConsoleProgress(progress: MockConsoleProgress): void {
  try {
    localStorage.setItem(storageKey(progress.scenarioId), JSON.stringify(progress));
  } catch {
    // localStorage unavailable (quota, private browsing) — nothing to persist to
  }
}

// Caches the parsed record per scenario, keyed by the raw stored string, so repeated
// reads of an unchanged value return the same object reference. Without this,
// useSyncExternalStore (which calls loadConsoleProgress as its getSnapshot) sees a
// "new" value on every render and loops — see platform-shell's lib/progress/storage.ts.
const parsedCache = new Map<string, { raw: string; value: MockConsoleProgress }>();

export function loadConsoleProgress(scenarioId: string): MockConsoleProgress | null {
  try {
    const raw = localStorage.getItem(storageKey(scenarioId));
    if (raw === null) return null;

    const cached = parsedCache.get(scenarioId);
    if (cached && cached.raw === raw) return cached.value;

    const parsed = JSON.parse(raw);
    if (!isMockConsoleProgress(parsed, scenarioId)) return null;

    parsedCache.set(scenarioId, { raw, value: parsed });
    return parsed;
  } catch {
    return null;
  }
}

export function clearConsoleProgress(scenarioId: string): void {
  try {
    localStorage.removeItem(storageKey(scenarioId));
  } catch {
    // ignore
  }
}
