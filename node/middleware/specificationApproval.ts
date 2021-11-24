import { json } from 'co-body';
import {
  endpoint,
  getMasterDataSeller,
  getSpecificationFromProduct,
  ResponseApiSpecifications,
  searchFieldValueAndSeller,
  ResponseApiSpecificationsError,
  createMasterDataColorApproval,
  getMasterDataColorByFieldValue,
  updateColor,
  updateColorDocumentVariationsAndSeller
} from '../shared';

/**
 * @export
 * @param {*} ctx
 */
export async function specificationApproval(ctx: Context) {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const {
    vtex: { workspace, account, logger },
    clients: { masterdata, suggestionsApproval },
    response: res,
    req
  } = ctx;

  const { sellerId, sellerSkuId } = await json(req);

  const response: ResponseApiSpecifications = {
    responseSpecifications: null,
    resultMasterDataSeller: null,
    fieldValuesFromSpecifications: null,
    responseMasterDataColors: null,
    responseCreateColorApprovalMasterData: null,
    responseAssignColorMasterData: null,
    typeActionForMakeWithTheSpecification: null
  };

  /**
   * Método para realizar el response de la petición
   * @param responseInformation
   */
  const returnResponse = (
    responseInformation: ResponseApiSpecifications | ResponseApiSpecificationsError
  ) => {
    try {
      logger.info(responseInformation);
      res.body = responseInformation;
      res.status = 200;
    } catch (error) {
      res.body = error;
      res.status = 400;
    }
  };

  if (!sellerId || !sellerSkuId) {
    res.body = 'Not have the necessary params to launch the process, verify your params';
    res.status = 500;
  }

  /** Obtener las espeficaciones del producto, se consulta la espacificación en base a los datos proporcionados */
  const getSuggestions = async () => {
    const url = endpoint(workspace).getProductSuggestion({
      sellerId,
      sellerSkuId,
      account
    });
    logger.info('Url to use in the search of the api suggestion');
    logger.info(url);

    response.responseSpecifications = await suggestionsApproval.getSpecifications(url, logger);

    if (response.responseSpecifications && response.responseSpecifications.Content) {
      return true;
    }
    return returnResponse({
      message: 'Se ha presentado un problema al obtener la información de la espacificación del producto',
      data: {
        type: 'responseSpecifications',
        value: response.responseSpecifications
      }
    });
  };

  /** Permite obtener la información configurada en la app de colores para el seller,
   *  emplea el id del seller para buscar en masterData
   *  cual es el specificationName a emplear.
   */
  const getSellerInformation = async () => {
    response.resultMasterDataSeller = await getMasterDataSeller({
      masterdata,
      sellerId
    });

    logger.info('****************************');
    logger.info('Response from masterData for the search of sellers');
    logger.info(response.resultMasterDataSeller);

    if (response.resultMasterDataSeller && response.resultMasterDataSeller.length) {
      return true;
    }
    return returnResponse({
      message: 'Se ha presentado un problema al obtener el seller indicado',
      data: {
        type: 'resultMasterDataSeller',
        value: response.resultMasterDataSeller
      }
    });
  };

  /**
   * Método encargado de obtener los colores registrados en base a la especificación indicada
   */
  const getColorsFromMasterData = async () => {
    if (
      response &&
      response.resultMasterDataSeller &&
      response.resultMasterDataSeller.length &&
      response.responseSpecifications
    ) {
      /** Get color specification with the specificationName of the seller */
      response.fieldValuesFromSpecifications = getSpecificationFromProduct(
        response.resultMasterDataSeller[0],
        response.responseSpecifications
      );

      logger.info('****************************');
      logger.info('Response from vtex for get the specification for the api of suggestions');
      logger.info(response.fieldValuesFromSpecifications);

      /**  Search color with the current specification,
       *  find if this specification exist or not for pass to create */
      response.responseMasterDataColors = await getMasterDataColorByFieldValue({
        masterdata,
        fieldValue: response.fieldValuesFromSpecifications[0]
      });

      return true;
    }

    return returnResponse({
      message: 'Se ha presentado un problema al usar la información para obtener los colores creados',
      data: {
        type: 'resultMasterDataSeller and responseSpecifications',
        value: {
          resultMasterDataSeller: response.resultMasterDataSeller,
          responseSpecifications: response.responseSpecifications
        }
      }
    });
  };

  /**
   * Método encargado de hacer el update de la información como variación y seller del color
   */
  const updateColorInformation = async (positionColor: number) => {
    if (response.responseMasterDataColors && response.fieldValuesFromSpecifications) {
      logger.info({
        sellerId,
        color: response.responseMasterDataColors,
        specifications: response.fieldValuesFromSpecifications[0]
      });

      const checkIfHaveChangesInTheColor = updateColorDocumentVariationsAndSeller({
        sellerId,
        color: response.responseMasterDataColors[positionColor],
        fieldValue: response.fieldValuesFromSpecifications[0]
      });

      if (checkIfHaveChangesInTheColor) {
        logger.info('************************');
        logger.info(`The information to update in the document is ${checkIfHaveChangesInTheColor}`);

        response.responseAssignColorMasterData = await updateColor({
          masterdata,
          doc: checkIfHaveChangesInTheColor
        });
        return true;
      }
      return false;
    }
    return false;
  };

  await getSuggestions();
  await getSellerInformation();
  await getColorsFromMasterData();

  if (response && response.responseMasterDataColors && response.fieldValuesFromSpecifications) {
    /** Search the exact fieldValue in the name, value or variation
     * then search if the fieldValue exist and have the current seller in the sellerList */
    const validateTypeAction = searchFieldValueAndSeller({
      sellerId,
      responseMasterDataColors: response.responseMasterDataColors,
      fieldValue: response.fieldValuesFromSpecifications[0]
    });
    response.typeActionForMakeWithTheSpecification = validateTypeAction.typeResponse;

    logger.info('****************************');
    logger.info(
      'Response from masterData for get the color in base of the fieldValue in the specification product'
    );
    logger.info(response.responseMasterDataColors);
    logger.info('Type of action to make');
    logger.info(response.typeActionForMakeWithTheSpecification);
    console.log(response.typeActionForMakeWithTheSpecification);

    // Proceo para validar que acción realizar con el fieldValue
    if (response.typeActionForMakeWithTheSpecification === 'exist') {
      return returnResponse({
        message:
          'El fieldValue obtenido del producto ya se encuentra registrado al igual que el seller indicado.',
        data: {
          value: response
        }
      });
    }

    if (response.typeActionForMakeWithTheSpecification === 'haveVariationButNotHaveSeller') {
      /** Pass to the process to update the color information, this process validate if
       *  have the fieldValue or have the seller
       *  if not have add this information and make the update in masterData */
      const makeUpdate = await updateColorInformation(validateTypeAction.colorIndex);
      if (!makeUpdate) {
        logger.info(
          'Not have specifications to update, the indicated specification already exist in the selected color'
        );
        response.responseAssignColorMasterData = {
          message: 'The selected color from masterData already have the passed specification',
          color: response.responseMasterDataColors[0],
          specificationToCreate: {
            sellerId,
            value: response.fieldValuesFromSpecifications[0]
          }
        };
      } else {
        returnResponse(response);
      }
    } else if (
      response.typeActionForMakeWithTheSpecification === 'notHaveVariationNameAndValue' ||
      response.typeActionForMakeWithTheSpecification === 'notHaveAnything'
    ) {
      logger.info('not have specification, pass to create the new specification color in state *pending*');

      const fieldValue = {
        sellerId,
        state: 'pending',
        specificationName: response.fieldValuesFromSpecifications[0],
        specificationValue: '',
        creationDate: `${year}-${month}-${day}`
      };

      response.responseCreateColorApprovalMasterData = await createMasterDataColorApproval({
        masterdata,
        fieldValue
      });

      logger.info('****************************');
      logger.info('Response from masterData for create one color approval with the state pending');
      logger.info(response.responseCreateColorApprovalMasterData);

      returnResponse(response);
    } else {
      return returnResponse({
        message: 'Se ha presentado un problema al validar la información',
        data: {
          value: response
        }
      });
    }
  }
}
