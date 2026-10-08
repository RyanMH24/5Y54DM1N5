import type { MockConsoleScenario } from "@/types/mock-console";
import { demoScenario } from "./demo-scenario";

export const scenarios: Record<string, MockConsoleScenario> = {
  [demoScenario.id]: demoScenario,
};
