import type { MockConsoleScenario } from "@/types/mock-console";
import { scenarios } from "@/content/mock-consoles";

export function getScenarioById(id: string): MockConsoleScenario | null {
  return scenarios[id] ?? null;
}
