// ========================================
// File: src/automation/types.ts
// ========================================

export interface AutomationEvent {
  id: string;
  type: string;
  payload: any;
  timestamp: Date;
}

export interface AutomationAction {
  id: string;
  type: string;
  enabled: boolean;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  enabled: boolean;
  actions: AutomationAction[];
}