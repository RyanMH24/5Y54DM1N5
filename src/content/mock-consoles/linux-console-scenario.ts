import type { MockConsoleScenario } from "@/types/mock-console";

export const linuxConsoleScenario: MockConsoleScenario = {
  id: "linux-console-scenario",
  title: "Linux Server Console — Guided Scenario",
  productName: "Linux Server Console",
  sections: [
    {
      id: "servers",
      label: "Servers",
      records: [
        {
          id: "server-web01",
          title: "web-01 — serving errors, nginx not responding",
          fields: {
            resourceCheck: "Not run",
            diskStatus: "92% full",
            packageStatus: "Outdated",
            serviceStatus: "Stopped",
            healthCheck: "Unverified",
            userAudit: "Not run",
            permissionStatus: "Misconfigured",
            cronJob: "Not scheduled",
            sshHardening: "Root login enabled",
            logRotation: "Not configured",
            incidentDoc: "Not documented",
          },
        },
      ],
    },
  ],
  actions: [
    {
      id: "run-diagnostics-web01",
      label: "Run Resource Diagnostics",
      sectionId: "servers",
      recordId: "server-web01",
      updates: { resourceCheck: "Disk 92% full, nginx package outdated" },
    },
    {
      id: "free-disk-web01",
      label: "Free Up Disk Space",
      sectionId: "servers",
      recordId: "server-web01",
      updates: { diskStatus: "38% full" },
    },
    {
      id: "update-packages-web01",
      label: "Update Packages",
      sectionId: "servers",
      recordId: "server-web01",
      updates: { packageStatus: "Up to date" },
    },
    {
      id: "restart-service-web01",
      label: "Restart Service",
      sectionId: "servers",
      recordId: "server-web01",
      updates: { serviceStatus: "Running" },
    },
    {
      id: "verify-health-web01",
      label: "Verify Service Health",
      sectionId: "servers",
      recordId: "server-web01",
      updates: { healthCheck: "Healthy" },
    },
    {
      id: "audit-users-web01",
      label: "Audit User Accounts",
      sectionId: "servers",
      recordId: "server-web01",
      updates: { userAudit: "No stale accounts found" },
    },
    {
      id: "fix-permissions-web01",
      label: "Fix File Permissions",
      sectionId: "servers",
      recordId: "server-web01",
      updates: { permissionStatus: "Corrected" },
    },
    {
      id: "schedule-cleanup-web01",
      label: "Schedule Disk Cleanup Job",
      sectionId: "servers",
      recordId: "server-web01",
      updates: { cronJob: "Scheduled nightly" },
    },
    {
      id: "harden-ssh-web01",
      label: "Harden SSH Access",
      sectionId: "servers",
      recordId: "server-web01",
      updates: { sshHardening: "Root login disabled" },
    },
    {
      id: "rotate-logs-web01",
      label: "Rotate Log Files",
      sectionId: "servers",
      recordId: "server-web01",
      updates: { logRotation: "Configured" },
    },
    {
      id: "document-incident-web01",
      label: "Document Incident",
      sectionId: "servers",
      recordId: "server-web01",
      updates: { incidentDoc: "Documented" },
    },
  ],
  tasks: [
    {
      id: "task-run-diagnostics-web01",
      instructions:
        "web-01 is serving errors and nginx seems to be down. Before changing anything, run diagnostics to see what's actually wrong.",
      expectedActionId: "run-diagnostics-web01",
      successMessage: "Diagnostics show the disk is nearly full and the nginx package is outdated.",
      fallbackMessage:
        "That's not a diagnostic step. Select web-01 and choose Run Resource Diagnostics.",
    },
    {
      id: "task-free-disk-web01",
      instructions:
        "A nearly-full disk can stop a service from writing logs or temp files. Free up disk space on web-01.",
      expectedActionId: "free-disk-web01",
      successMessage: "Disk space has been freed on web-01.",
      fallbackMessage: "That doesn't free up disk space. Select web-01 and choose Free Up Disk Space.",
    },
    {
      id: "task-update-packages-web01",
      instructions:
        "Diagnostics also flagged an outdated nginx package with a known fix available. Update packages on web-01.",
      expectedActionId: "update-packages-web01",
      successMessage: "Packages on web-01 have been updated.",
      fallbackMessage: "That's not it. Select web-01 and choose Update Packages.",
    },
    {
      id: "task-restart-service-web01",
      instructions:
        "With disk space freed and packages updated, bring nginx back online. Restart the service on web-01.",
      expectedActionId: "restart-service-web01",
      successMessage: "The service on web-01 has been restarted.",
      fallbackMessage: "That doesn't restart the service. Select web-01 and choose Restart Service.",
    },
    {
      id: "task-verify-health-web01",
      instructions: "Confirm the fix actually worked before closing this out. Verify service health on web-01.",
      expectedActionId: "verify-health-web01",
      successMessage: "web-01's service health has been verified.",
      fallbackMessage: "That's not it. Select web-01 and choose Verify Service Health.",
    },
    {
      id: "task-audit-users-web01",
      instructions:
        "While you're in there, audit the user accounts on web-01 for anything that shouldn't still have access.",
      expectedActionId: "audit-users-web01",
      successMessage: "No stale accounts were found on web-01.",
      fallbackMessage: "That's not an account audit. Select web-01 and choose Audit User Accounts.",
    },
    {
      id: "task-fix-permissions-web01",
      instructions:
        "The audit turned up a misconfigured permission on a shared directory. Fix the file permissions on web-01.",
      expectedActionId: "fix-permissions-web01",
      successMessage: "File permissions on web-01 have been corrected.",
      fallbackMessage: "That doesn't fix permissions. Select web-01 and choose Fix File Permissions.",
    },
    {
      id: "task-schedule-cleanup-web01",
      instructions: "To stop the disk from filling up again, schedule a disk cleanup job on web-01.",
      expectedActionId: "schedule-cleanup-web01",
      successMessage: "A nightly disk cleanup job has been scheduled on web-01.",
      fallbackMessage:
        "That doesn't schedule a cleanup job. Select web-01 and choose Schedule Disk Cleanup Job.",
    },
    {
      id: "task-harden-ssh-web01",
      instructions: "Root login over SSH is still enabled on web-01. Harden SSH access before closing this out.",
      expectedActionId: "harden-ssh-web01",
      successMessage: "SSH access on web-01 has been hardened — root login is now disabled.",
      fallbackMessage: "That's not it. Select web-01 and choose Harden SSH Access.",
    },
    {
      id: "task-rotate-logs-web01",
      instructions: "Rotate web-01's log files so they stop eating disk space long-term.",
      expectedActionId: "rotate-logs-web01",
      successMessage: "Log rotation has been configured on web-01.",
      fallbackMessage: "That doesn't rotate logs. Select web-01 and choose Rotate Log Files.",
    },
    {
      id: "task-document-incident-web01",
      instructions: "Everything is fixed and hardened. Document the incident for the team.",
      expectedActionId: "document-incident-web01",
      successMessage: "The incident on web-01 has been documented.",
      fallbackMessage: "That doesn't document the incident. Select web-01 and choose Document Incident.",
    },
  ],
};
