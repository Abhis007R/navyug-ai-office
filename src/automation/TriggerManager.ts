// ========================================
// File: src/automation/TriggerManager.ts
// ========================================

import { AutomationEvent } from "./types";
import { RULES } from "./RuleRegistry";
import { runAction } from "./ActionManager";

export class TriggerManager {

  static async process(event: AutomationEvent): Promise<void> {

    console.log(`⚡ Trigger Received: ${event.type}`);

    // Find all matching enabled rules
    const matchingRules = RULES.filter(
      rule =>
        rule.enabled &&
        rule.trigger === event.type
    );

    if (matchingRules.length === 0) {
      console.log("No automation rule found.");
      return;
    }

    // Execute every action
    for (const rule of matchingRules) {

      console.log(`Running Rule: ${rule.name}`);

      for (const action of rule.actions) {

        if (!action.enabled) continue;

        await runAction(action.type, event);

      }

    }

  }

}