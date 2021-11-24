import { json } from 'co-body';

export async function getState(ctx: Context) {
  const {
    response,
    req,
    clients: {},
    vtex: { account }
  } = ctx;
  const config = await json(req);

  response.body = {
    ...{ account, config, state: true }
  };
  response.status = 200;

  return response;
}
