import { json } from 'co-body';
import _ from 'lodash';
import { IColors } from '../shared';

/**
 * Permite filtrar en la respuesta de vtex de masterData los colores indicados,
 * se emplead encodeURI ya que el campo que se manda a buscar se encuentra así para
 * poder traer resultados de masterData correctamente
 */
const findColor = (colorResponse: IColors[], color: string, sellerId: string) => {
  console.log(colorResponse);
  console.log(color);

  return colorResponse.find((item: IColors) => {
    const sellerList = item.sellers ? item.sellers.split(',') : [];
    const foundSeller = sellerList.find((seller: string) => seller === sellerId);

    if (foundSeller) {
      return (
        encodeURIComponent(item.colorName) === color ||
        encodeURIComponent(item.value) === color ||
        encodeURIComponent(item.variations).includes(color)
      );
    }
    return false;
  });
};

const findColorWithoutSeller = (colorResponse: IColors[], color: string) => {
  console.log(colorResponse);
  console.log(color);

  return colorResponse.find(
    (item: IColors) =>
      encodeURIComponent(item.colorName) === color ||
      encodeURIComponent(item.value) === color ||
      encodeURIComponent(item.variations).includes(color)
  );
};

export async function searchColors(ctx: Context) {
  const {
    clients: { colors },
    response,
    vtex: { logger },
    req
  } = ctx;
  const { filter, keyword, type } = await json(req);

  console.log(filter, keyword, type);

  if (!filter || !keyword || !type) {
    response.body = 'Not have the necessary params to launch the process, verify your params';
    response.status = 500;
  }

  let colorList: any = [];

  const processResponse = (colorResponse: IColors[], color: string, sellerId?: string) => {
    if (colorResponse.length) {
      console.log(colorResponse);

      /**
       * Se encarga de buscar el color por la key indicada para así filtrar los colores y
       * retornar valores solo si realmente se encontró el resultado.
       */
      const findColorInResponse = sellerId
        ? findColor(colorResponse, color, sellerId)
        : findColorWithoutSeller(colorResponse, color);
      if (findColorInResponse) {
        /**
         * Armo un array para luego validar que solo existan elementos unicos por id para
         * que no retorne registros duplicados.
         */
        const foundColorByItem = Array(findColorInResponse);
        colorList = _.unionBy(colorList, foundColorByItem, 'id');
      }
    } else {
      logger.info('Not have results for the search with the fields params');
    }
  };

  if (type && type === 'filter') {
    await Promise.all(
      keyword.map(async (color: string) => {
        const colorResponse: IColors[] = await colors.searchColor(`${filter}${color}`);
        processResponse(colorResponse, color);
      })
    );
  } else {
    await Promise.all(
      keyword.map(async ({ color, sellerId }: { color: string; sellerId: string }) => {
        const sellerList = sellerId.split(',');
        /**
         * Realizo una consulta por cada seller proporcionado, para así validar
         * las variaciones del produto por seller
         */
        await Promise.all(
          sellerList.map(async (seller) => {
            const colorResponse: IColors[] = await colors.searchColor(
              `${filter}${color}&_where=sellers=*${seller}*`
            );

            processResponse(colorResponse, color, seller);
          })
        );
      })
    );
  }

  console.log(colorList);

  response.body = colorList;
  response.status = 200;
  return response;
}
