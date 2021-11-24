import { method, ParamsContext, RecorderState, Service, ServiceContext } from '@vtex/api';
import { clients } from './clients';
import { Clients } from './clients/index';
import { authenticate } from './middleware/authenticate';
import { getState } from './middleware/getState';
import { resolvers } from './resolvers';

declare global {
  /** We declare a global Context type just to avoid re-writing ServiceContext<Clients, State>
   *  in every handler and resolver*/
  type Context = ServiceContext<Clients>;
}

export default new Service<Clients, RecorderState, ParamsContext>({
  clients,
  graphql: {
    resolvers
  },
  routes: {
    getState: method({
      GET: [authenticate, getState]
    })
  }
});
