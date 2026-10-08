import type { MockConsoleScenario } from "@/types/mock-console";
import { demoScenario } from "./demo-scenario";
import { identityConsoleScenario } from "./identity-console-scenario";
import { deviceConsoleScenario } from "./device-console-scenario";

export const scenarios: Record<string, MockConsoleScenario> = {
  [demoScenario.id]: demoScenario,
  [identityConsoleScenario.id]: identityConsoleScenario,
  [deviceConsoleScenario.id]: deviceConsoleScenario,
};
