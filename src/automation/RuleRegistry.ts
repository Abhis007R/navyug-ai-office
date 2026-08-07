// ========================================
// File: src/automation/RuleRegistry.ts
// ========================================

import { AutomationRule } from "./types";

export const RULES: AutomationRule[] = [
  {
    id: "rule-donor-created",
    name: "New Donor Added",
    trigger: "DONOR_CREATED",
    enabled: true,
    actions: [
      {
        id: "refresh-crm",
        type: "REFRESH_CRM",
        enabled: true,
      },
      {
        id: "activity-log",
        type: "CREATE_ACTIVITY_LOG",
        enabled: true,
      },
      {
        id: "ceo-notification",
        type: "CEO_NOTIFICATION",
        enabled: true,
      },
    ],
  },

  {
    id: "rule-student-created",
    name: "New Student Registered",
    trigger: "STUDENT_CREATED",
    enabled: true,
    actions: [
      {
        id: "refresh-crm",
        type: "REFRESH_CRM",
        enabled: true,
      },
      {
        id: "activity-log",
        type: "CREATE_ACTIVITY_LOG",
        enabled: true,
      },
    ],
  },

  {
    id: "rule-volunteer-created",
    name: "Volunteer Joined",
    trigger: "VOLUNTEER_CREATED",
    enabled: true,
    actions: [
      {
        id: "refresh-crm",
        type: "REFRESH_CRM",
        enabled: true,
      },
      {
        id: "activity-log",
        type: "CREATE_ACTIVITY_LOG",
        enabled: true,
      },
    ],
  },

  {
    id: "rule-donation-received",
    name: "Donation Received",
    trigger: "DONATION_RECEIVED",
    enabled: true,
    actions: [
      {
        id: "update-finance",
        type: "UPDATE_FINANCE",
        enabled: true,
      },
      {
        id: "refresh-dashboard",
        type: "REFRESH_DASHBOARD",
        enabled: true,
      },
      {
        id: "ceo-notification",
        type: "CEO_NOTIFICATION",
        enabled: true,
      },
    ],
  },
];