import {
  fieldResolver as fieldResolverDefault,
  mutation as mutationDefault,
  queries as queriesDefault
} from './default';

export const resolvers = {
  ...fieldResolverDefault,
  Query: {
    ...queriesDefault
  },
  Mutation: {
    ...mutationDefault
  }
};
