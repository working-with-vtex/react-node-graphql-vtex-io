import { ClientsConfig, IOClients, LRUCache } from '@vtex/api';
import { DefaultDataSource } from './default';

export class Clients extends IOClients {
  get default() {
    return this.getOrSet('default', DefaultDataSource);
  }
}

const TIMEOUT_MS = 5000;

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 5000 });

metrics.trackCache('configuration-administration', memoryCache);

// This is the configuration for clients available in `ctx.clients`.
export const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 2,
      timeout: TIMEOUT_MS
    },
    // This key will be merged with the default options and add this cache to our Status client.
    status: {
      memoryCache
    }
  }
};
