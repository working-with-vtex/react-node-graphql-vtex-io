import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, EmptyState, Input, PageBlock, PageHeader, Spinner, Tag, InputButton } from 'vtex.styleguide';
import { config, ISellersColor, UseSellersManager } from '../../../../../../shared';

type OptionToAdd = 'specificationName';

const SellerInformation = (props: { sellersManager: UseSellersManager }) => {
  const {
    sellersManager: {
      sellerById,
      searchSellerById,
      runtime,
      loadingQuery,
      errorOnGetSellers,
      saveChangesSellerById,
      setSellerById
    }
  } = props;
  const [temporalSeller, setTemporalSeller] = useState<ISellersColor | null>(null);
  const [idCurrentColor, setIdCurrentColor] = useState<string | null>(null);
  const [haveChanges, setHaveChanges] = useState(false);
  const [sellerList, setSellerList] = useState<string[]>([]);
  const [errorKeySpecificationName, setErrorKeySpecificationName] = useState('');
  const [newSpecificationName, setNewSpecificationName] = useState('');

  const { route } = runtime;

  useEffect(() => {
    if (idCurrentColor) {
      searchSellerById(idCurrentColor);
    }
  }, [idCurrentColor]);

  useEffect(() => {
    const copyColor = sellerById ? Object.assign({}, sellerById) : null;
    if (copyColor) {
      setTemporalSeller(copyColor);
      setHaveChanges(false);
    }
  }, [sellerById]);

  useEffect(() => {
    if (route.params && route.params.id) {
      setIdCurrentColor(route.params.id);
    }
  }, [route]);

  useEffect(() => {
    if (
      temporalSeller &&
      temporalSeller.sellerName !== '' &&
      temporalSeller.sellerId !== '' &&
      temporalSeller.specificationName !== ''
    ) {
      setHaveChanges(!_.isEqual(sellerById, temporalSeller));
    } else {
      setHaveChanges(false);
    }

    if (temporalSeller) {
      setSellerList(getListFromString(temporalSeller.specificationName));
    }
  }, [temporalSeller]);

  const getListFromString = (text: string) => {
    return text ? text.split(',') : [];
  };

  const handlerSaveChanges = () => {
    if (temporalSeller) {
      saveChangesSellerById(temporalSeller);
      setSellerById(temporalSeller);
    }
  };

  const updateKeyInTemColor = (key: OptionToAdd, list: string[]) => {
    let text = '';
    list.map((item, index) => {
      text += `${index != 0 ? ',' : ''}${item}`;
    });
    if (temporalSeller) {
      setTemporalSeller({ ...temporalSeller, [key]: text });
    }
  };

  const deleteItem = (index: number, key: OptionToAdd) => {
    if (key == 'specificationName') {
      sellerList.splice(index, 1);
      updateKeyInTemColor(key, sellerList);
      setErrorKeySpecificationName('');
    }
  };

  const addNewItemSpecification = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setErrorKeySpecificationName('');

    if (temporalSeller && newSpecificationName != '') {
      setTemporalSeller({
        ...temporalSeller,
        specificationName: (temporalSeller.specificationName += `${
          temporalSeller.specificationName == '' ? '' : ','
        }${newSpecificationName}`)
      });
      setNewSpecificationName('');
    }
  };

  if (errorOnGetSellers) {
    return (
      <PageBlock>
        <EmptyState title="Seller no encontrado">
          <p>valida que el id sea correcto</p>

          <div className="pt5">
            <Button
              variation="secondary"
              size="small"
              onClick={() => {
                runtime.navigate({
                  page: config.colorConfiguration,
                  params: { id: 'sellers' }
                });
              }}
            >
              <span className="flex align-baseline">Volver</span>
            </Button>
          </div>
        </EmptyState>
      </PageBlock>
    );
  }

  if (loadingQuery || !temporalSeller) {
    return (
      <PageBlock variation="annotated" title="Buscando seller" subtitle="espere un momento...">
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      </PageBlock>
    );
  }

  return (
    <div className="pa5">
      <PageHeader
        title="Edita la información del vendedor"
        linkLabel="Volver"
        subtitle={<Tag>{temporalSeller.sellerName}</Tag>}
        onLinkClick={(_e: any) => {
          runtime.navigate({
            page: config.colorConfiguration,
            params: { id: 'sellers' }
          });
        }}
      >
        <span className="mr4">
          <Button variation="primary" disabled={!haveChanges} onClick={() => handlerSaveChanges()}>
            Actualizar
          </Button>
        </span>
      </PageHeader>

      <PageBlock variation="full">
        <div className="flex items-center justify-between">
          <div className="flex flex-column w-100">
            <div className="flex w-100">
              <div className="mb5 w-50">
                <Input
                  label="Identificador del vendedor"
                  errorMessage={!temporalSeller.sellerId ? '¡Campo requerido!' : ''}
                  onChange={(e: any) => setTemporalSeller({ ...temporalSeller, sellerId: e.target.value })}
                  value={temporalSeller.sellerId}
                />
              </div>
              <div className="mb5 ml5 w-50">
                <Input
                  label="Nombre del vendedor"
                  errorMessage={!temporalSeller.sellerName ? '¡Campo requerido!' : ''}
                  onChange={(e: any) => setTemporalSeller({ ...temporalSeller, sellerName: e.target.value })}
                  value={temporalSeller.sellerName}
                />
              </div>
            </div>

            <div>
              <h6 className="t-heading-6 mt4 mb5">Especificación</h6>

              <div className="flex flex-wrap">
                {sellerList.map((item, index) => {
                  if (item == '') return null;
                  return (
                    <span className="mr4 pt4 db" style={{ width: 'auto' }} key={`tag-element${index}`}>
                      <Tag onClick={() => deleteItem(index, 'specificationName')}>{item}</Tag>
                    </span>
                  );
                })}
              </div>

              <form onSubmit={addNewItemSpecification} className="mt5">
                <InputButton
                  placeholder="Agregar una nueva especificación del vendedor"
                  size="regular"
                  button="Agregar"
                  onChange={(e: any) => setNewSpecificationName(e.target.value)}
                  value={newSpecificationName}
                  errorMessage={errorKeySpecificationName ? errorKeySpecificationName : ''}
                />
              </form>
            </div>
          </div>
        </div>
      </PageBlock>
    </div>
  );
};

export default SellerInformation;
