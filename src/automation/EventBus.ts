// ========================================
// File: src/automation/EventBus.ts
// ========================================

import { AutomationEvent } from "./types";

type EventListener = (event: AutomationEvent) => void | Promise<void>;

class EventBus {
  private listeners: Map<string, EventListener[]> = new Map();

  subscribe(eventType: string, listener: EventListener) {
    const existing = this.listeners.get(eventType) || [];
    existing.push(listener);
    this.listeners.set(eventType, existing);
  }

  unsubscribe(eventType: string, listener: EventListener) {
    const existing = this.listeners.get(eventType) || [];

    this.listeners.set(
      eventType,
      existing.filter(l => l !== listener)
    );
  }

  async publish(event: AutomationEvent) {
    const listeners = this.listeners.get(event.type) || [];

    for (const listener of listeners) {
      await listener(event);
    }
  }

  clear() {
    this.listeners.clear();
  }
}

export const eventBus = new EventBus();