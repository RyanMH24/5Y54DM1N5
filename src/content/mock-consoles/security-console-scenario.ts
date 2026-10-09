import type { MockConsoleScenario } from "@/types/mock-console";

export const securityConsoleScenario: MockConsoleScenario = {
  id: "security-console-scenario",
  title: "Security Console — Guided Scenario",
  productName: "Security Console",
  sections: [
    {
      id: "alerts",
      label: "Alerts",
      records: [
        {
          id: "alert-morgan",
          title: "Security Alert — Morgan Lee (reported phishing click)",
          fields: {
            alertStatus: "New",
            sessionStatus: "Active",
            passwordStatus: "Unchanged",
            mfaEnabled: "No",
            malwareScan: "Not run",
            signInLogs: "Not reviewed",
            domainBlock: "Not blocked",
            managerNotified: "No",
            incidentReport: "Not filed",
            securityTraining: "Not scheduled",
          },
        },
      ],
    },
  ],
  actions: [
    {
      id: "acknowledge-alert-morgan",
      label: "Acknowledge Alert",
      sectionId: "alerts",
      recordId: "alert-morgan",
      updates: { alertStatus: "Investigating" },
    },
    {
      id: "revoke-sessions-morgan",
      label: "Revoke Active Sessions",
      sectionId: "alerts",
      recordId: "alert-morgan",
      updates: { sessionStatus: "Revoked" },
    },
    {
      id: "force-password-reset-morgan",
      label: "Force Password Reset",
      sectionId: "alerts",
      recordId: "alert-morgan",
      updates: { passwordStatus: "Reset Required" },
    },
    {
      id: "enable-mfa-morgan",
      label: "Enable MFA",
      sectionId: "alerts",
      recordId: "alert-morgan",
      updates: { mfaEnabled: "Yes" },
    },
    {
      id: "scan-malware-morgan",
      label: "Scan Device for Malware",
      sectionId: "alerts",
      recordId: "alert-morgan",
      updates: { malwareScan: "Clean" },
    },
    {
      id: "review-signin-logs-morgan",
      label: "Review Sign-In Logs",
      sectionId: "alerts",
      recordId: "alert-morgan",
      updates: { signInLogs: "No unauthorized access found" },
    },
    {
      id: "block-domain-morgan",
      label: "Block Phishing Domain",
      sectionId: "alerts",
      recordId: "alert-morgan",
      updates: { domainBlock: "Blocked at email gateway" },
    },
    {
      id: "notify-manager-morgan",
      label: "Notify Manager",
      sectionId: "alerts",
      recordId: "alert-morgan",
      updates: { managerNotified: "Yes" },
    },
    {
      id: "file-report-morgan",
      label: "File Incident Report",
      sectionId: "alerts",
      recordId: "alert-morgan",
      updates: { incidentReport: "Filed" },
    },
    {
      id: "schedule-training-morgan",
      label: "Schedule Security Training",
      sectionId: "alerts",
      recordId: "alert-morgan",
      updates: { securityTraining: "Scheduled" },
    },
    {
      id: "close-alert-morgan",
      label: "Close Alert",
      sectionId: "alerts",
      recordId: "alert-morgan",
      updates: { alertStatus: "Resolved" },
    },
  ],
  tasks: [
    {
      id: "task-acknowledge-morgan",
      instructions:
        "A phishing alert just came in — Morgan Lee reported clicking a suspicious link. Acknowledge the alert to begin investigating.",
      expectedActionId: "acknowledge-alert-morgan",
      successMessage: "The alert is now being investigated.",
      fallbackMessage:
        "That doesn't acknowledge the alert. Select the alert and choose Acknowledge Alert.",
    },
    {
      id: "task-revoke-sessions-morgan",
      instructions:
        "Before anything else, cut off any session an attacker might already have. Revoke Morgan Lee's active sessions.",
      expectedActionId: "revoke-sessions-morgan",
      successMessage: "Morgan Lee's active sessions have been revoked.",
      fallbackMessage:
        "That's not it. Select the alert and choose Revoke Active Sessions.",
    },
    {
      id: "task-force-password-reset-morgan",
      instructions:
        "Morgan Lee's password may have been captured by the phishing page. Force a password reset.",
      expectedActionId: "force-password-reset-morgan",
      successMessage: "A password reset has been forced on Morgan Lee's account.",
      fallbackMessage:
        "That doesn't reset the password. Select the alert and choose Force Password Reset.",
    },
    {
      id: "task-enable-mfa-morgan",
      instructions:
        "To make a stolen password alone useless next time, enable MFA on Morgan Lee's account.",
      expectedActionId: "enable-mfa-morgan",
      successMessage: "MFA has been enabled on Morgan Lee's account.",
      fallbackMessage: "That's not it. Select the alert and choose Enable MFA.",
    },
    {
      id: "task-scan-malware-morgan",
      instructions: "Before declaring this contained, scan Morgan Lee's device for malware.",
      expectedActionId: "scan-malware-morgan",
      successMessage: "Morgan Lee's device scanned clean — no malware found.",
      fallbackMessage: "That's not a malware scan. Select the alert and choose Scan Device for Malware.",
    },
    {
      id: "task-review-signin-logs-morgan",
      instructions: "Check whether anyone else actually signed in using Morgan Lee's account. Review sign-in logs.",
      expectedActionId: "review-signin-logs-morgan",
      successMessage: "No unauthorized sign-ins were found in Morgan Lee's account logs.",
      fallbackMessage: "That doesn't review sign-in logs. Select the alert and choose Review Sign-In Logs.",
    },
    {
      id: "task-block-domain-morgan",
      instructions: "Stop this from reaching anyone else. Block the phishing domain at the email gateway.",
      expectedActionId: "block-domain-morgan",
      successMessage: "The phishing domain has been blocked at the email gateway.",
      fallbackMessage: "That's not it. Select the alert and choose Block Phishing Domain.",
    },
    {
      id: "task-notify-manager-morgan",
      instructions: "Morgan Lee's manager should know about this. Notify the manager.",
      expectedActionId: "notify-manager-morgan",
      successMessage: "Morgan Lee's manager has been notified.",
      fallbackMessage: "That doesn't notify the manager. Select the alert and choose Notify Manager.",
    },
    {
      id: "task-file-report-morgan",
      instructions: "Every incident needs a paper trail. File an incident report.",
      expectedActionId: "file-report-morgan",
      successMessage: "An incident report has been filed for this alert.",
      fallbackMessage: "That doesn't file a report. Select the alert and choose File Incident Report.",
    },
    {
      id: "task-schedule-training-morgan",
      instructions: "Help Morgan Lee spot the next one. Schedule a security awareness refresher.",
      expectedActionId: "schedule-training-morgan",
      successMessage: "Security awareness training has been scheduled for Morgan Lee.",
      fallbackMessage:
        "That doesn't schedule training. Select the alert and choose Schedule Security Training.",
    },
    {
      id: "task-close-alert-morgan",
      instructions: "Containment, remediation, and follow-up are complete. Close the alert.",
      expectedActionId: "close-alert-morgan",
      successMessage: "The alert has been closed.",
      fallbackMessage: "That doesn't close the alert. Select the alert and choose Close Alert.",
    },
  ],
};
