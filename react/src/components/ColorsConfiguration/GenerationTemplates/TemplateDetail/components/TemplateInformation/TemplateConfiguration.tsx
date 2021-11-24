import React, { useEffect, useState } from 'react';
import { Button, Input, EXPERIMENTAL_Select as Select, PageBlock, Link } from 'vtex.styleguide';
import {
  ISelectType,
  ISellersColor,
  UseColorsTemplateInformationManager,
  UseColorsTemplateManager,
  UseSellersManager
} from '../../../../../../shared';

export interface PropsTemplateConfiguration {
  haveChanges: boolean;
  handlerSaveChanges: () => void;
  colorsTemplateInformationManager: UseColorsTemplateInformationManager;
  colorsTemplateManager: UseColorsTemplateManager;
  sellersManager: UseSellersManager;
}

const TemplateConfiguration = (props: PropsTemplateConfiguration) => {
  const {
    colorsTemplateManager: { temporalTemplateId, setTemporalTemplateId },
    sellersManager: { searchSellers, sellersList }
  } = props;
  const { haveChanges, handlerSaveChanges } = props;
  const [selectOptions, setSelectOptions] = useState<ISelectType[]>([]);
  const [defaultSeller, setDefaultSeller] = useState<ISelectType>();
  const [productsCreatedAutomaticIdList, setProductsCreatedAutomaticIdList] = useState<string[]>([]);
  const [productsIdList, setProductsIdList] = useState<string[]>([]);

  useEffect(() => {
    searchSellers();
  }, []);

  useEffect(() => {
    if (temporalTemplateId && temporalTemplateId.productsCreatedAutomaticId) {
      const list = temporalTemplateId.productsCreatedAutomaticId.split(',');
      setProductsCreatedAutomaticIdList(list);
    } else {
      setProductsCreatedAutomaticIdList([]);
    }
    if (temporalTemplateId && temporalTemplateId.productsId) {
      const list = temporalTemplateId.productsId.split(',');
      setProductsIdList(list);
    } else {
      setProductsIdList([]);
    }
  }, [temporalTemplateId]);

  useEffect(() => {
    if (sellersList && temporalTemplateId) {
      let sellers: ISelectType[] = Object.assign([], sellersList);
      sellers.map((item) => {
        item.label = item.sellerName;
        item.value = item.sellerId;
      });
      console.debug(sellers);
      console.debug(temporalTemplateId.sellerName);

      const currentSeller = sellers.find((item) => item.sellerId == temporalTemplateId.sellerName);
      console.debug(currentSeller);
      setDefaultSeller(currentSeller);
      setSelectOptions(sellers);
    }
  }, [sellersList]);

  const handlerSelectSeller = (selectedSeller: ISellersColor) => {
    if (selectedSeller && temporalTemplateId) {
      setTemporalTemplateId({
        ...temporalTemplateId,
        sellerName: selectedSeller.sellerId,
        sellerFieldName: selectedSeller.specificationName
      });
      const currentSeller = selectOptions.find(
        (item) => item.sellerId == selectedSeller.sellerId && item.sellerName == selectedSeller.sellerName
      );
      console.debug(currentSeller);
      setDefaultSeller(currentSeller);
    }
  };

  if (!temporalTemplateId) return null;

  return (
    <div>
      <p className="t-heading-5 fw6 mb5 ml0 mt4">Configuración del template</p>

      <div className="flex w-100 mb5">
        <Input
          label="Nombre de la plantilla"
          maxLength={40}
          errorMessage={!temporalTemplateId.nameTemplate ? '¡Campo requerido!' : ''}
          onChange={(e: any) =>
            setTemporalTemplateId({ ...temporalTemplateId, nameTemplate: e.target.value })
          }
          value={temporalTemplateId.nameTemplate}
        />
      </div>
      <div className="flex w-100 mb5">
        <Input
          label="Estado de los productos a consultar en VTEX"
          disabled={true}
          errorMessage={!temporalTemplateId.statusParam ? '¡Campo requerido!' : ''}
          value={temporalTemplateId.statusParam}
        />
      </div>
      <div className="flex items-center justify-between w-100">
        <div className="flex flex-column w-100">
          <p className="t-heading-5 fw6 mb5 ml0 mt4">Configuración del seller a consultar</p>

          <div className="flex w-100">
            <div className="mb5 w-50">
              <Select
                value={defaultSeller}
                label="Selecciona un vendedor"
                options={selectOptions}
                multi={false}
                placeholder="Selecciona..."
                errorMessage={!temporalTemplateId.sellerFieldName ? '¡Campo requerido!' : ''}
                loading={!sellersList.length}
                loadingMessage="Buscando vendedores"
                onChange={(values) => {
                  handlerSelectSeller(values);
                }}
              />
            </div>

            <div className="mb5 ml5 w-50">
              <Input
                label="Especificación del seller"
                disabled={true}
                errorMessage={!temporalTemplateId.sellerFieldName ? '¡Campo requerido!' : ''}
                value={temporalTemplateId.sellerFieldName}
              />
            </div>
          </div>

          <p className="t-heading-5 fw6 mb5 ml0 mt4">Configuración de la consulta</p>

          <div className="flex w-100">
            <div className="mb5">
              <Input
                type="number"
                min="20"
                max="30"
                disabled={true}
                label="Total de productos a consultar"
                onChange={(e: any) =>
                  setTemporalTemplateId({ ...temporalTemplateId, total: Number(e.target.value) })
                }
                value={temporalTemplateId.total}
              />
            </div>

            <div className="ml5">
              <Input
                disabled={true}
                type="number"
                errorMessage={!temporalTemplateId.to ? '¡Campo requerido!' : ''}
                label="Productos a procesar por cada consulta"
                value={temporalTemplateId.to}
              />
            </div>

            <div className="ml5">
              <Input
                type="number"
                onChange={(e: any) =>
                  setTemporalTemplateId({ ...temporalTemplateId, from: Number(e.target.value) })
                }
                disabled={true}
                min="1"
                errorMessage={!temporalTemplateId.from ? '¡Campo requerido!' : ''}
                label="Productos procesados"
                value={temporalTemplateId.from}
              />
            </div>
          </div>

          <div className="flex items-center justify-between ">
            <div className="flex flex-column">
              <p className="t-heading-5 fw6 mb5 ml0 mt4">Creador de la plantilla</p>

              <div className="flex w-100">
                <div className="mb5">
                  <Input label="Usuario" disabled={true} value={temporalTemplateId.user} />
                </div>
              </div>
            </div>
          </div>
          
          <PageBlock title="Productos que no pudieron ser procesados" variation="half">
            <div className="mb5">
              <Input
                type="number"
                min="0"
                label="Total de productos con errores"
                disabled={true}
                value={temporalTemplateId.productsWithErrors}
              />
            </div>
            <div className="flex flex-wrap" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {productsIdList.map((item) => {
                return (
                  <div className="mr4 w-25">
                    <Link
                      href={`/admin/received-skus/seller/${temporalTemplateId.sellerName}/item/${item}/`}
                      target="_blank"
                      mediumWeigth
                    >
                      {item}
                    </Link>
                  </div>
                );
              })}
            </div>
          </PageBlock>

          <PageBlock title="Productos que fueron procesados automáticamente" variation="half">
            <div className="mb5">
              <Input
                type="number"
                min="0"
                label="Total de productos"
                disabled={true}
                value={temporalTemplateId.productsCreatedAutomatic}
              />
            </div>
            <div className="flex flex-wrap" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {productsCreatedAutomaticIdList.map((item) => {
                return (
                  <div className="mr4 w-25">
                    <Link
                      href={`/admin/received-skus/seller/${temporalTemplateId.sellerName}/item/${item}/`}
                      target="_blank"
                      mediumWeigth
                    >
                      {item}
                    </Link>
                  </div>
                );
              })}
            </div>
          </PageBlock>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Button variation="primary" disabled={!haveChanges} onClick={() => handlerSaveChanges()}>
          Actualizar
        </Button>
      </div>
    </div>
  );
};

export default TemplateConfiguration;
