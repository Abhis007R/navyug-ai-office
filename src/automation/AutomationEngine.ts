// ========================================
// File: src/automation/AutomationEngine.ts
// ========================================

import { AutomationEvent } from "./types";
import { eventBus } from "./EventBus";
import { TriggerManager } from "./TriggerManager";

export class AutomationEngine {

  /**
   * Initialize automation system.
   * Call this once when the app starts.
   */
  static initialize() {

    console.log("🚀 Automation Engine Initialized");

    eventBus.subscribe(
      "AUTOMATION_EVENT",
      async (event: AutomationEvent) => {

        await TriggerManager.process(event);

      }
    );

  }

  /**
   * Trigger an automation event.
   */
  static async trigger(
    type: string,
    payload: any
  ) {

    const event: AutomationEvent = {
      id: crypto.randomUUID(),
      type,
      payload,
      timestamp: new Date(),
    };

    await eventBus.publish({
      ...event,
      type: "AUTOMATION_EVENT",
      payload: event,
    });

  }

}