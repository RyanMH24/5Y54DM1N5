import type { Quiz } from "@/types/curriculum";
import { sampleQuiz } from "./sample-quiz";
import { networkingBasicsQuiz } from "./networking-basics-quiz";
import { osFundamentalsQuiz } from "./os-fundamentals-quiz";
import { hardwareTroubleshootingQuiz } from "./hardware-troubleshooting-quiz";
import { terminologyQuiz } from "./terminology-quiz";
import { linuxCliBasicsQuiz } from "./linux-cli-basics-quiz";
import { linuxUsersPermissionsQuiz } from "./linux-users-permissions-quiz";
import { linuxPackageManagementQuiz } from "./linux-package-management-quiz";
import { powershellBasicsQuiz } from "./powershell-basics-quiz";
import { powershellScriptingBasicsQuiz } from "./powershell-scripting-basics-quiz";
import { powershellAdUserManagementQuiz } from "./powershell-ad-user-management-quiz";
import { identityAccessBasicsQuiz } from "./identity-access-basics-quiz";
import { appleMdmBasicsQuiz } from "./apple-mdm-basics-quiz";
import { securityAccessBasicsQuiz } from "./security-access-basics-quiz";
import { phishingSocialEngineeringQuiz } from "./phishing-social-engineering-quiz";
import { endpointSecurityBasicsQuiz } from "./endpoint-security-basics-quiz";
import { cloudVirtualizationBasicsQuiz } from "./cloud-virtualization-basics-quiz";
import { backupDisasterRecoveryBasicsQuiz } from "./backup-disaster-recovery-basics-quiz";
import { itsmTicketLifecycleQuiz } from "./itsm-ticket-lifecycle-quiz";

export const quizzes: Record<string, Quiz> = {
  [sampleQuiz.id]: sampleQuiz,
  [networkingBasicsQuiz.id]: networkingBasicsQuiz,
  [osFundamentalsQuiz.id]: osFundamentalsQuiz,
  [hardwareTroubleshootingQuiz.id]: hardwareTroubleshootingQuiz,
  [terminologyQuiz.id]: terminologyQuiz,
  [linuxCliBasicsQuiz.id]: linuxCliBasicsQuiz,
  [linuxUsersPermissionsQuiz.id]: linuxUsersPermissionsQuiz,
  [linuxPackageManagementQuiz.id]: linuxPackageManagementQuiz,
  [powershellBasicsQuiz.id]: powershellBasicsQuiz,
  [powershellScriptingBasicsQuiz.id]: powershellScriptingBasicsQuiz,
  [powershellAdUserManagementQuiz.id]: powershellAdUserManagementQuiz,
  [identityAccessBasicsQuiz.id]: identityAccessBasicsQuiz,
  [appleMdmBasicsQuiz.id]: appleMdmBasicsQuiz,
  [securityAccessBasicsQuiz.id]: securityAccessBasicsQuiz,
  [phishingSocialEngineeringQuiz.id]: phishingSocialEngineeringQuiz,
  [endpointSecurityBasicsQuiz.id]: endpointSecurityBasicsQuiz,
  [cloudVirtualizationBasicsQuiz.id]: cloudVirtualizationBasicsQuiz,
  [backupDisasterRecoveryBasicsQuiz.id]: backupDisasterRecoveryBasicsQuiz,
  [itsmTicketLifecycleQuiz.id]: itsmTicketLifecycleQuiz,
};
