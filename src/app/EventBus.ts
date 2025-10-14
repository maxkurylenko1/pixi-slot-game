type EventHandler<T = any> = (payload: T) => void;

export class EventBus {
  private static events = new Map<string, EventHandler[]>();

  static on<T>(event: string, handler: EventHandler<T>) {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event)!.push(handler as EventHandler);
  }

  static emit<T>(event: string, payload: T) {
    const handlers = this.events.get(event);
    if (handlers) handlers.forEach((h) => h(payload));
  }

  static off<T>(event: string, handler: EventHandler<T>) {
    const handlers = this.events.get(event);
    if (!handlers) return;
    this.events.set(
      event,
      handlers.filter((h) => h !== handler)
    );
  }
}
