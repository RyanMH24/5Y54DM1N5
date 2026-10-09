import type { MockConsoleScenario } from "@/types/mock-console";

export const cloudBackupConsoleScenario: MockConsoleScenario = {
  id: "cloud-backup-console-scenario",
  title: "Cloud Console — Guided Scenario",
  productName: "Cloud Console",
  sections: [
    {
      id: "vms",
      label: "Virtual Machines",
      records: [
        {
          id: "vm-prod-db01",
          title: "prod-db01 (VM) — nightly backup failed",
          fields: {
            storageStatus: "Unknown",
            backupJob: "Failed",
            lastVerifiedRestore: "Never",
            alertStatus: "Open",
            otherBackupsAudit: "Not run",
            retentionPolicy: "Unchanged",
            storageAlert: "Not configured",
            rootCauseDoc: "Not documented",
            drRunbook: "Not updated",
            stakeholdersNotified: "No",
          },
        },
      ],
    },
  ],
  actions: [
    {
      id: "check-storage-proddb01",
      label: "Check Backup Storage Capacity",
      sectionId: "vms",
      recordId: "vm-prod-db01",
      updates: { storageStatus: "Target volume full" },
    },
    {
      id: "expand-storage-proddb01",
      label: "Expand Backup Storage",
      sectionId: "vms",
      recordId: "vm-prod-db01",
      updates: { storageStatus: "Space available" },
    },
    {
      id: "retry-backup-proddb01",
      label: "Retry Backup Job",
      sectionId: "vms",
      recordId: "vm-prod-db01",
      updates: { backupJob: "Completed" },
    },
    {
      id: "verify-restore-proddb01",
      label: "Test Restore From Backup",
      sectionId: "vms",
      recordId: "vm-prod-db01",
      updates: { lastVerifiedRestore: "Verified" },
    },
    {
      id: "audit-other-backups-proddb01",
      label: "Audit Other Backup Jobs",
      sectionId: "vms",
      recordId: "vm-prod-db01",
      updates: { otherBackupsAudit: "No other jobs at risk" },
    },
    {
      id: "update-retention-policy-proddb01",
      label: "Update Backup Retention Policy",
      sectionId: "vms",
      recordId: "vm-prod-db01",
      updates: { retentionPolicy: "Updated to 30 days" },
    },
    {
      id: "configure-storage-alert-proddb01",
      label: "Configure Low-Storage Alert",
      sectionId: "vms",
      recordId: "vm-prod-db01",
      updates: { storageAlert: "Configured" },
    },
    {
      id: "document-root-cause-proddb01",
      label: "Document Root Cause",
      sectionId: "vms",
      recordId: "vm-prod-db01",
      updates: { rootCauseDoc: "Documented" },
    },
    {
      id: "update-dr-runbook-proddb01",
      label: "Update DR Runbook",
      sectionId: "vms",
      recordId: "vm-prod-db01",
      updates: { drRunbook: "Updated" },
    },
    {
      id: "notify-stakeholders-proddb01",
      label: "Notify Stakeholders",
      sectionId: "vms",
      recordId: "vm-prod-db01",
      updates: { stakeholdersNotified: "Yes" },
    },
    {
      id: "close-alert-proddb01",
      label: "Close Alert",
      sectionId: "vms",
      recordId: "vm-prod-db01",
      updates: { alertStatus: "Resolved" },
    },
  ],
  tasks: [
    {
      id: "task-check-storage-proddb01",
      instructions: "prod-db01's nightly backup failed overnight. Check the backup storage to see why.",
      expectedActionId: "check-storage-proddb01",
      successMessage: "The backup target volume is full — that's why last night's job failed.",
      fallbackMessage:
        "That's not a diagnostic step. Select prod-db01 and choose Check Backup Storage Capacity.",
    },
    {
      id: "task-expand-storage-proddb01",
      instructions: "The backup target volume is full. Expand the backup storage.",
      expectedActionId: "expand-storage-proddb01",
      successMessage: "Backup storage for prod-db01 has been expanded.",
      fallbackMessage: "That doesn't free up storage. Select prod-db01 and choose Expand Backup Storage.",
    },
    {
      id: "task-retry-backup-proddb01",
      instructions: "With space freed up, retry last night's backup job for prod-db01.",
      expectedActionId: "retry-backup-proddb01",
      successMessage: "The backup job for prod-db01 has completed.",
      fallbackMessage: "That's not it. Select prod-db01 and choose Retry Backup Job.",
    },
    {
      id: "task-verify-restore-proddb01",
      instructions:
        "A backup you've never restored from is an unverified assumption, not a safety net. Test a restore from the new backup.",
      expectedActionId: "verify-restore-proddb01",
      successMessage: "A test restore from prod-db01's backup has been verified.",
      fallbackMessage:
        "That doesn't test the restore. Select prod-db01 and choose Test Restore From Backup.",
    },
    {
      id: "task-audit-other-backups-proddb01",
      instructions: "Check whether any other VMs share the same storage volume and are at risk of the same failure.",
      expectedActionId: "audit-other-backups-proddb01",
      successMessage: "No other VMs are at risk from the same storage issue.",
      fallbackMessage:
        "That's not an audit of other jobs. Select prod-db01 and choose Audit Other Backup Jobs.",
    },
    {
      id: "task-update-retention-policy-proddb01",
      instructions: "The current retention policy isn't giving enough buffer. Update the backup retention policy.",
      expectedActionId: "update-retention-policy-proddb01",
      successMessage: "The backup retention policy for prod-db01 has been updated.",
      fallbackMessage:
        "That doesn't update the retention policy. Select prod-db01 and choose Update Backup Retention Policy.",
    },
    {
      id: "task-configure-storage-alert-proddb01",
      instructions: "Make sure this doesn't happen silently again. Configure a low-storage alert.",
      expectedActionId: "configure-storage-alert-proddb01",
      successMessage: "A low-storage alert has been configured for prod-db01's backup volume.",
      fallbackMessage:
        "That's not it. Select prod-db01 and choose Configure Low-Storage Alert.",
    },
    {
      id: "task-document-root-cause-proddb01",
      instructions: "Document the root cause of the failed backup for the post-incident review.",
      expectedActionId: "document-root-cause-proddb01",
      successMessage: "The root cause of the backup failure has been documented.",
      fallbackMessage:
        "That doesn't document the root cause. Select prod-db01 and choose Document Root Cause.",
    },
    {
      id: "task-update-dr-runbook-proddb01",
      instructions: "Update the disaster recovery runbook with what you learned from this incident.",
      expectedActionId: "update-dr-runbook-proddb01",
      successMessage: "The DR runbook has been updated with this incident's findings.",
      fallbackMessage: "That doesn't update the runbook. Select prod-db01 and choose Update DR Runbook.",
    },
    {
      id: "task-notify-stakeholders-proddb01",
      instructions: "Let the people who depend on prod-db01 know the backup issue has been resolved.",
      expectedActionId: "notify-stakeholders-proddb01",
      successMessage: "Stakeholders have been notified that the backup issue is resolved.",
      fallbackMessage:
        "That doesn't notify stakeholders. Select prod-db01 and choose Notify Stakeholders.",
    },
    {
      id: "task-close-alert-proddb01",
      instructions: "The backup is confirmed good and everyone's been briefed. Close the alert.",
      expectedActionId: "close-alert-proddb01",
      successMessage: "The backup alert for prod-db01 has been closed.",
      fallbackMessage: "That doesn't close the alert. Select prod-db01 and choose Close Alert.",
    },
  ],
};
