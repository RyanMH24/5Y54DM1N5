import type { MockConsoleScenario } from "@/types/mock-console";

export const deviceConsoleScenario: MockConsoleScenario = {
  id: "device-console-scenario",
  title: "Device Console — Guided Scenario",
  productName: "Device Console",
  sections: [
    {
      id: "devices",
      label: "Devices",
      records: [
        {
          id: "device-ipad",
          title: "iPad — Front Desk",
          fields: { serial: "DMPKX1A2B3", status: "Unenrolled", profile: "None" },
        },
        {
          id: "device-iphone",
          title: "iPhone — Jordan Lee",
          fields: { serial: "FQTRN4C5D6", status: "Enrolled", profile: "Standard Security" },
        },
      ],
    },
  ],
  actions: [
    {
      id: "enroll-ipad",
      label: "Enroll Device",
      sectionId: "devices",
      recordId: "device-ipad",
      updates: { status: "Enrolled" },
    },
    {
      id: "apply-profile-ipad",
      label: "Apply Standard Security Profile",
      sectionId: "devices",
      recordId: "device-ipad",
      updates: { profile: "Standard Security" },
    },
    {
      id: "lock-iphone",
      label: "Remote Lock Device",
      sectionId: "devices",
      recordId: "device-iphone",
      updates: { status: "Locked" },
    },
    {
      id: "apply-profile-iphone",
      label: "Apply Kiosk Mode Profile",
      sectionId: "devices",
      recordId: "device-iphone",
      updates: { profile: "Kiosk Mode" },
    },
  ],
  tasks: [
    {
      id: "task-enroll-ipad",
      instructions: "The front desk iPad hasn't been enrolled yet. Enroll the iPad — Front Desk device.",
      expectedActionId: "enroll-ipad",
      successMessage: "The iPad — Front Desk has been enrolled.",
      fallbackMessage:
        "That doesn't enroll the device. Select the iPad — Front Desk record and choose Enroll Device.",
    },
    {
      id: "task-apply-profile-ipad",
      instructions:
        "Now that it's enrolled, apply the Standard Security configuration profile to the iPad — Front Desk.",
      expectedActionId: "apply-profile-ipad",
      successMessage: "The Standard Security profile has been applied to the iPad — Front Desk.",
      fallbackMessage:
        "That's not it. Select the iPad — Front Desk record and choose Apply Standard Security Profile.",
    },
    {
      id: "task-lock-iphone",
      instructions:
        "Jordan Lee has reported their iPhone lost. Remote lock the iPhone — Jordan Lee device to protect company data.",
      expectedActionId: "lock-iphone",
      successMessage: "The iPhone — Jordan Lee has been remotely locked.",
      fallbackMessage:
        "That doesn't lock the device. Select the iPhone — Jordan Lee record and choose Remote Lock Device.",
    },
  ],
};
