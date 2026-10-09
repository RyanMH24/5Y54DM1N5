import type { MockConsoleScenario } from "@/types/mock-console";
import { demoScenario } from "./demo-scenario";
import { identityConsoleScenario } from "./identity-console-scenario";
import { deviceConsoleScenario } from "./device-console-scenario";
import { ticketConsoleScenario } from "./ticket-console-scenario";
import { linuxConsoleScenario } from "./linux-console-scenario";
import { adConsoleScenario } from "./ad-console-scenario";
import { securityConsoleScenario } from "./security-console-scenario";
import { cloudBackupConsoleScenario } from "./cloud-backup-console-scenario";

export const scenarios: Record<string, MockConsoleScenario> = {
  [demoScenario.id]: demoScenario,
  [identityConsoleScenario.id]: identityConsoleScenario,
  [deviceConsoleScenario.id]: deviceConsoleScenario,
  [ticketConsoleScenario.id]: ticketConsoleScenario,
  [linuxConsoleScenario.id]: linuxConsoleScenario,
  [adConsoleScenario.id]: adConsoleScenario,
  [securityConsoleScenario.id]: securityConsoleScenario,
  [cloudBackupConsoleScenario.id]: cloudBackupConsoleScenario,
};
