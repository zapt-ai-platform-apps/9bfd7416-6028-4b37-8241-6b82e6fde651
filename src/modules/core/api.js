import { eventBus } from './events';
import { createValidator } from './validators';

/**
 * Public API for the core module
 * Provides access to core functionality for other modules
 */
export const api = {
  events: {
    subscribe: eventBus.subscribe.bind(eventBus),
    publish: eventBus.publish.bind(eventBus),
    unsubscribe: eventBus.unsubscribe.bind(eventBus)
  },
  createValidator
};