/**
 * Core event bus implementation for inter-module communication
 */
export class EventBus {
  subscribers = {};

  /**
   * Subscribe to an event
   * @param {string} event - The event name to subscribe to
   * @param {Function} callback - The callback to execute when the event is published
   * @returns {Function} - Unsubscribe function
   */
  subscribe(event, callback) {
    if (!this.subscribers[event]) this.subscribers[event] = [];
    this.subscribers[event].push(callback);
    return () => this.unsubscribe(event, callback);
  }

  /**
   * Publish an event
   * @param {string} event - The event name to publish
   * @param {any} data - The data to pass to subscribers
   */
  publish(event, data) {
    if (!this.subscribers[event]) return;
    this.subscribers[event].forEach(callback => callback(data));
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - The event name to unsubscribe from
   * @param {Function} callback - The callback to remove
   */
  unsubscribe(event, callback) {
    if (!this.subscribers[event]) return;
    this.subscribers[event] = this.subscribers[event]
      .filter(cb => cb !== callback);
  }
}

// Create a singleton event bus
export const eventBus = new EventBus();