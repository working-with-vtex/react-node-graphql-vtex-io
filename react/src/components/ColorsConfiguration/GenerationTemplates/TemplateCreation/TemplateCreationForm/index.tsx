import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, PageHeader, PageBlock, Input, EXPERIMENTAL_Select as Select } from 'vtex.styleguide';
import {
  config,
  IColorsTemplateCreation,
  ISellersColor,
  ISelectType,
  UseColorsTemplateInformationManager,
  UseColorsTemplateManager,
  UseSellersManager
} from '../../../../../shared';

const EmptySeller = {
  sellerId: '',
  sellerName: '',
  specificationName: '',
  value: '',
  label: 'Seleccione un vendedor',
  id: ''
};

interface Props {
  colorsTemplateInformationManager: UseColorsTemplateInformationManager;
  colorsTemplateManager: UseColorsTemplateManager;
  sellersManager: UseSellersManager;
}

let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

const emptyTemplate: IColorsTemplateCreation = {
  creationDate: `${year}-${month}-${day}`,
  nameTemplate: '',
  from: 1,
  productsId: '',
  productsWithErrors: 0,
  sellerFieldName: '',
  sellerName: '',
  status: 'stopped',
  statusParam: 'pending',
  productsCreatedAutomatic: 0,
  productsCreatedAutomaticId: '',
  to: 20,
  total: 0,
  user: ''
};

const TemplateCreationForm = (props: Props) => {
  const {
    sellersManager: { searchSellers, sellersList },
    colorsTemplateManager: { runtime, userEmail, handlerCreateTemplate }
  } = props;

  const [temporalTemplate, setTemporalTemplate] = useState<IColorsTemplateCreation>(emptyTemplate);
  const [haveChanges, setHaveChanges] = useState(false);
  const [selectOptions, setSelectOptions] = useState<ISelectType[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<ISellersColor>(EmptySeller);

  useEffect(() => {
    searchSellers();
  }, []);

  useEffect(() => {
    if (
      temporalTemplate.nameTemplate !== '' &&
      temporalTemplate.sellerName !== '' &&
      temporalTemplate.sellerFieldName !== '' &&
      temporalTemplate.user !== ''
    ) {
      setHaveChanges(!_.isEqual(emptyTemplate, temporalTemplate));
    } else {
      setHaveChanges(false);
    }
  }, [temporalTemplate]);

  useEffect(() => {
    if (userEmail) {
      setTemporalTemplate({ ...temporalTemplate, user: userEmail });
    }
    if (sellersList) {
      let sellers: ISelectType[] = Object.assign([], sellersList);
      sellers.map((item) => {
        item.label = item.sellerName;
        item.value = item.sellerId;
      });
      setSelectOptions([EmptySeller].concat(sellers));
    }
  }, [userEmail, sellersList]);

  const handlerClear = () => {
    setSelectedSeller(EmptySeller);
    setTemporalTemplate({ ...emptyTemplate, user: userEmail });
  };

  const handlerSave = () => {
    if (temporalTemplate) {
      console.debug(temporalTemplate);
      handlerCreateTemplate(temporalTemplate);
    }
  };

  const handlerSelectSeller = (selectedSeller: ISellersColor) => {
    if (selectedSeller) {
      setSelectedSeller(selectedSeller);
      setTemporalTemplate({
        ...temporalTemplate,
        sellerName: selectedSeller.sellerId,
        sellerFieldName: selectedSeller.specificationName
      });
    }
  };

  return (
    <div className="pa5">
      <PageHeader
        title="Creación de una plantilla"
        linkLabel="Volver"
        onLinkClick={(_e: any) => {
          runtime.navigate({
            page: config.colorConfiguration,
            params: { id: 'generateTemplate' }
          });
        }}
      >
        <span className="mr4">
          <Button variation="secondary" disabled={!haveChanges} onClick={() => handlerClear()}>
            Limpiar
          </Button>
        </span>

        <Button variation="primary" disabled={!haveChanges || !userEmail} onClick={() => handlerSave()}>
          Crear
        </Button>
      </PageHeader>

      <PageBlock variation="full">
        <div className="flex items-center justify-between">
          <div className="flex flex-column w-100">
            <h4 className="t-heading-6 mt0"> Configuración del template </h4>
            <div className="flex">
              <div className="mb5 w-50">
                <Input
                  label="Nombre de la plantilla"
                  maxLength={40}
                  errorMessage={!temporalTemplate.nameTemplate ? '¡Campo requerido!' : ''}
                  onChange={(e: any) =>
                    setTemporalTemplate({ ...temporalTemplate, nameTemplate: e.target.value })
                  }
                  value={temporalTemplate.nameTemplate}
                />
              </div>

              <div className="mb5 ml5 w-50">
                <Input
                  errorMessage={!temporalTemplate.user ? '¡Campo requerido!' : ''}
                  label="Usuario creador del template"
                  disabled={true}
                  value={temporalTemplate.user}
                />
              </div>
            </div>
            <div className="flex">
              <div className="mb5 w-50">
                <Select
                  label="Selecciona un vendedor"
                  options={selectOptions}
                  multi={false}
                  value={selectedSeller}
                  placeholder="Selecciona..."
                  errorMessage={!temporalTemplate.sellerFieldName ? '¡Campo requerido!' : ''}
                  loading={!sellersList.length}
                  loadingMessage="Buscando vendedores"
                  onChange={(values) => {
                    handlerSelectSeller(values);
                  }}
                />
              </div>

              <div className="mb5 ml5 w-50">
                <Input
                  label="Especificación del vendedor"
                  disabled={true}
                  value={temporalTemplate.sellerFieldName}
                />
              </div>
            </div>
          </div>
        </div>
      </PageBlock>
    </div>
  );
};

export default TemplateCreationForm;
