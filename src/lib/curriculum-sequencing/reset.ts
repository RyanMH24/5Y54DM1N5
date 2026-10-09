const APP_STORAGE_PREFIX = "sysadmin-academy:";

export function clearAllProgress(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith(APP_STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // localStorage unavailable (quota, private browsing) — nothing to clear
  }
}
