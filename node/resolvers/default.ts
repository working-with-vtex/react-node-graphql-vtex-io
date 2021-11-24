import { result } from 'lodash';

export const queries = {
  getState: (_: any, {}: any, { clients }: Context) => clients.default.getState()
};

export const mutation = {
  getState: (_: any, {}: any, { clients }: Context) => clients.default.getState()
};

export const fieldResolver = {
  QueryGetStateResponse: {
    state: (o: any) => result<boolean>(o, 'state')
  },
  MutationGetStateResponse: {
    state: (o: any) => result<boolean>(o, 'state')
  }
};
