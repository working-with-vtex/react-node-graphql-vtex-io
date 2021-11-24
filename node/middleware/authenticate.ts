export async function authenticate(ctx: any, next: () => Promise<any>) {
  const { account } = ctx.vtex;

  ctx.set('cache-control', 'no-cache');
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', '*');

  if (account === 'puntoscolombia' || account === 'puntoscolombiaqa' || account === 'puntoscolombiaio') {
    if (
      ctx.request.headers['x-vtex-api-apptoken'] ===
        'TDVOVQIGVENFRFTEIVSGIQMJEITWNXFUYKPJINGZKXYZYZGQCLSDJEGDQMJMWLSYYTHGPJVUOTWLRNKFCCUBFCKTEMTWDTCZEZAFRZBTPXOQIVLCBEKTRRTWIOCCQZQU' &&
      ctx.request.headers['x-vtex-api-appkey'] === 'vtexappkey-puntoscolombia-JIJTBF'
    ) {
      await next();
    } else {
      ctx.status = 401;
      return;
    }
  }
}
