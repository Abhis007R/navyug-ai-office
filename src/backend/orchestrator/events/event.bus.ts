type EventHandler = (payload: any) => void;

class EventBus {
  private listeners: Map<string, EventHandler[]> = new Map();

  subscribe(event: string, handler: EventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event)?.push(handler);
  }

  publish(event: string, payload: any) {
    console.log(`📢 Event: ${event}`);

    const handlers = this.listeners.get(event);

    if (!handlers) return;

    handlers.forEach((handler) => handler(payload));
  }
}

export const eventBus = new EventBus();