// ========================================
// File: src/automation/ActivityLogger.ts
// ========================================

import { AutomationEvent } from "./types";

export class ActivityLogger {
  static async log(event: AutomationEvent) {
    console.log("📋 Activity Log");

    console.log({
      id: event.id,
      type: event.type,
      timestamp: event.timestamp,
      payload: event.payload,
    });
  }
}