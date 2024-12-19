// src/utils/EventEmitter.ts
type Listener = (...args: any[]) => void;

export class EventEmitter {
  private events: { [key: string]: Listener[] } = {};

  on(event: string, listener: Listener): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event: string, ...args: any[]): void {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
  }

  removeListener(event: string, listener: Listener): void {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
  }

  eventNames(): string[] {
    return Object.keys(this.events);
  }

  listenerCount(event: string): number {
    return this.events[event]?.length || 0;
  }
}