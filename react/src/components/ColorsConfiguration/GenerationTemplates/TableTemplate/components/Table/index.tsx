import React, { useEffect, useState } from 'react';
import { Table } from 'vtex.styleguide';
import { ColorConfigurationContext } from '../../../../../../Context';
import {
  config,
  IColorsTemplate,
  UseColorsTemplateInformationManager,
  UseColorsTemplateManager
} from '../../../../../../shared';
import { getJsonSchema } from './TableSchema';
const { useColorsConfiguration } = ColorConfigurationContext;

const initialTableLength = 10;
const defaultDensity = 'medium';

interface Props {
  colorsTemplateInformationManager: UseColorsTemplateInformationManager;
  colorsTemplateManager: UseColorsTemplateManager;
}

const TableTemplates = (props: Props) => {
  const {
    colorsTemplateInformationManager: {},
    colorsTemplateManager: { templates, searchTemplate, setSearchValue, searchValue, runtime }
  } = props;
  const [tableLength, setTableLength] = useState(initialTableLength);
  const [slicedData, setSliceData] = useState(templates.slice(0, tableLength));
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItemTo, setCurrentItemTo] = useState(tableLength);
  const [currentItemFrom, setCurrentItemFrom] = useState(1);
  const [itemsLength, setItemsLength] = useState(templates.length);
  const jsonschema = getJsonSchema();

  useEffect(() => {
    searchTemplate();
  }, []);

  useEffect(() => {
    if (templates) {
      console.debug(templates);
      setSliceData(templates.slice(0, tableLength));
      setItemsLength(templates.length);
      setCurrentPage(1);
      setCurrentItemTo(tableLength);
      setCurrentItemFrom(1);
    }
  }, [templates]);

  const handleInputSearchChange = (e: any) => {
    const filtered = templates.filter(
      (item) =>
        item.id.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.sellerName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.nameTemplate.toLowerCase().includes(e.target.value.toLowerCase())
    );
    console.debug(filtered);
    setSliceData(filtered.slice(0, tableLength));
    setSearchValue(e.target.value);
  };

  const clearState = () => {
    setSearchValue('');
    setSliceData(templates.slice(0, tableLength));
  };

  const handleInputSearchClear = () => {
    clearState();
  };

  const handleInputSearchSubmit = (e: any) => {
    e.preventDefault();

    if (!searchValue) {
      setSearchValue('');
      searchTemplate();
    } else {
      searchTemplate(e.target.value);
    }
  };

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    const itemFrom = currentItemTo + 1;
    const itemTo = tableLength * newPage;
    const data = templates.slice(itemFrom - 1, itemTo);
    goToPage(newPage, itemFrom, itemTo, data);
  };

  const handlePrevClick = () => {
    if (currentPage === 0) return;
    const newPage = currentPage - 1;
    const itemFrom = currentItemFrom - tableLength;
    const itemTo = currentItemFrom - 1;
    const data = templates.slice(itemFrom - 1, itemTo);
    goToPage(newPage, itemFrom, itemTo, data);
  };

  const goToPage = (
    currentPage: number,
    currentItemFrom: number,
    currentItemTo: number,
    slicedData: IColorsTemplate[]
  ) => {
    setCurrentPage(currentPage);
    setCurrentItemFrom(currentItemFrom);
    setCurrentItemTo(currentItemTo);
    setSliceData(slicedData);
  };

  const handleRowsChange = (_e: any, value: any) => {
    setTableLength(parseInt(value));
    setCurrentItemTo(parseInt(value));
    setSliceData(templates.slice(0, parseInt(value)));
    setItemsLength(templates.length);
  };

  return (
    <div>
      <Table
        schema={jsonschema}
        items={slicedData}
        density={defaultDensity}
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
        onRowClick={({ rowData }: { rowData: IColorsTemplate }) => {
          runtime.navigate({
            page: config.templateDetailRoute,
            params: { id: rowData.id }
          });
        }}
        toolbar={{
          inputSearch: {
            value: searchValue,
            placeholder: 'Buscar',
            onChange: handleInputSearchChange,
            onClear: handleInputSearchClear,
            onSubmit: handleInputSearchSubmit
          },
          newLine: {
            label: 'Nuevo',
            handleCallback: () =>
              runtime.navigate({
                page: config.colorTemplateCreationRoute
              }),
            actions: ['Recargar'].map((label) => ({
              label,
              onClick: () => {
                if (label == 'Recargar') {
                  if (searchValue) {
                    searchTemplate(searchValue);
                  } else {
                    searchTemplate();
                  }
                }
              }
            }))
          }
        }}
      />
    </div>
  );
};

const WrapperTable = () => {
  const state = useColorsConfiguration();
  if (!state) return null;

  return (
    <TableTemplates
      {...{
        ...state
      }}
    />
  );
};

export default WrapperTable;
