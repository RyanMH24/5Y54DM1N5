const STORAGE_KEY = "sysadmin-academy:curriculum-completion-seen";

export function hasSeenCompletionNotice(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function markCompletionNoticeSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // localStorage unavailable (quota, private browsing) — nothing to persist to
  }
}
