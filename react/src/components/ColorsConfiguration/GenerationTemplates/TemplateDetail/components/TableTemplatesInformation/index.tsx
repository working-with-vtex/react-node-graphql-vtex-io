import React, { useEffect, useState } from 'react';
import { Button, IconInfo, Table } from 'vtex.styleguide';
import ColorConfigurationContext from '../../../../../../Context/ColorConfigurationContext';
import {
  IColorsTemplateInformation,
  UseColorsTemplateInformationManager,
  UseColorsTemplateManager
} from '../../../../../../shared';
import styles from './index.css';
import { getJsonSchema } from './TableSchema';
const { useColorsConfiguration } = ColorConfigurationContext;

const initialTableLength = 10;
const defaultDensity = 'medium';

interface Props {
  handlerSearchTemplates: (param?: string | undefined) => void;
}

interface PropsActions extends Props {
  colorsTemplateInformationManager: UseColorsTemplateInformationManager;
  colorsTemplateManager: UseColorsTemplateManager;
}

const TableTemplatesInformation = (props: PropsActions) => {
  const {
    handlerSearchTemplates,
    colorsTemplateInformationManager: {
      templatesInformation,
      getTemplateItemsWithoutValue,
      searchValueInformation,
      getTemplateItemsDuplicate,
      hasBeenStartUpload,
      setSearchValueInformation,
      setIsModalAssignOpen,
      setColorTemplateToAssign,
      removeDuplicatesTemplateInformation,
      setTemplateInformationToDelete,
      handlerDeleteTemplateInformation
    },
    colorsTemplateManager: { showToast }
  } = props;

  const [tableLength, setTableLength] = useState(initialTableLength);
  const [slicedData, setSliceData] = useState(templatesInformation.slice(0, tableLength));
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItemTo, setCurrentItemTo] = useState(tableLength);
  const [currentItemFrom, setCurrentItemFrom] = useState(1);
  const [itemsLength, setItemsLength] = useState(templatesInformation.length);
  const jsonschema = getJsonSchema({
    slicedData,
    setTemplateInformationToDelete,
    handlerDeleteTemplateInformation,
    setIsModalAssignOpen,
    setColorTemplateToAssign
  });

  useEffect(() => {
    setSliceData(templatesInformation.slice(0, tableLength));
    setItemsLength(templatesInformation.length);
    setCurrentPage(1);
    setCurrentItemTo(tableLength);
    setCurrentItemFrom(1);
  }, [templatesInformation]);

  const handleInputSearchChange = (e: any) => {
    const filtered = templatesInformation.filter(
      (item) =>
        item.colorName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.value.toLowerCase().includes(e.target.value.toLowerCase()) ||
        (item.variations && item.variations.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.sellers && item.sellers.toLowerCase().includes(e.target.value.toLowerCase()))
    );
    console.debug(filtered);
    setSliceData(filtered.slice(0, tableLength));
    setSearchValueInformation(e.target.value);
  };

  const clearState = () => {
    setSearchValueInformation('');
    setSliceData(templatesInformation.slice(0, tableLength));
  };

  const handleInputSearchClear = () => {
    clearState();
  };

  const handleInputSearchSubmit = (e: any) => {
    e.preventDefault();
    console.debug(searchValueInformation);

    if (!searchValueInformation) {
      setSearchValueInformation('');
      handlerSearchTemplates();
    } else {
      handlerSearchTemplates(e.target.value);
    }
  };

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    const itemFrom = currentItemTo + 1;
    const itemTo = tableLength * newPage;
    const data = templatesInformation.slice(itemFrom - 1, itemTo);
    goToPage(newPage, itemFrom, itemTo, data);
  };

  const handlePrevClick = () => {
    if (currentPage === 0) return;
    const newPage = currentPage - 1;
    const itemFrom = currentItemFrom - tableLength;
    const itemTo = currentItemFrom - 1;
    const data = templatesInformation.slice(itemFrom - 1, itemTo);
    goToPage(newPage, itemFrom, itemTo, data);
  };

  const goToPage = (
    currentPage: number,
    currentItemFrom: number,
    currentItemTo: number,
    slicedData: IColorsTemplateInformation[]
  ) => {
    setCurrentPage(currentPage);
    setCurrentItemFrom(currentItemFrom);
    setCurrentItemTo(currentItemTo);
    setSliceData(slicedData);
  };

  const handleRowsChange = (_e: any, value: any) => {
    setTableLength(parseInt(value));
    setCurrentItemTo(parseInt(value));
    setSliceData(templatesInformation.slice(0, parseInt(value)));
    setItemsLength(templatesInformation.length);
  };

  return (
    <div>
      <Table
        schema={jsonschema}
        items={slicedData}
        density={defaultDensity}
        fixFirstColumn
        emptyStateLabel="No se han encontrado resultados"
        pagination={{
          onNextClick: handleNextClick,
          onPrevClick: handlePrevClick,
          currentItemFrom: currentItemFrom,
          currentItemTo: currentItemTo,
          onRowsChange: handleRowsChange,
          textShowRows: 'Mostrar filas',
          textOf: 'de',
          totalItems: itemsLength,
          rowsOptions: [10, 15, 25]
        }}
        onRowClick={({}: { rowData: IColorsTemplateInformation }) => {}}
        totalizers={[
          {
            label: 'Registros Duplicadas',
            value: getTemplateItemsDuplicate,
            iconBackgroundColor: getTemplateItemsDuplicate <= 0 ? 'green' : 'red',
            icon: <IconInfo color="#fff" size={20} />
          },
          {
            label: 'Registros sin un color asignado',
            value: getTemplateItemsWithoutValue,
            iconBackgroundColor: getTemplateItemsWithoutValue <= 0 ? 'green' : 'red',
            icon: <IconInfo color="#fff" size={20} />
          },
          {
            label: '',
            icon: (
              <span className={styles.deleteDuplicateContainer}>
                <div className={styles.deleteDuplicateItems}>
                  <Button
                    onClick={() =>
                      showToast({
                        message:
                          '¿Desea eliminar todos los registros duplicados, esta acción es irreversible?',
                        action: {
                          label: 'Eliminar dulicados',
                          onClick: () => removeDuplicatesTemplateInformation()
                        }
                      })
                    }
                    disabled={getTemplateItemsDuplicate <= 0 || hasBeenStartUpload}
                    variation="danger"
                    size="small"
                  >
                    Remover deplicados
                  </Button>
                </div>
              </span>
            )
          }
        ]}
        toolbar={{
          inputSearch: {
            value: searchValueInformation,
            placeholder: 'Buscar',
            onChange: handleInputSearchChange,
            onClear: handleInputSearchClear,
            onSubmit: handleInputSearchSubmit
          }
        }}
      />
    </div>
  );
};

const WrapperTable = (props: Props) => {
  const colorConfiguration = useColorsConfiguration();
  if (!colorConfiguration) return null;

  return (
    <TableTemplatesInformation
      {...{
        ...colorConfiguration,
        ...props
      }}
    />
  );
};

export default WrapperTable;
