import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api';

export class DefaultDataSource extends ExternalClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super('', ctx, {
      ...options,
      timeout: 10000
    });
  }

  getState() {
    return {
      state: true
    };
  }
}
