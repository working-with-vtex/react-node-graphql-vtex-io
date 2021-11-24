import React, { useEffect, useState } from 'react';
import { Table } from 'vtex.styleguide';
import { IColorCreationConfig, UseUploadColorsManager } from '../../../../../shared';
import styles from './index.css';
import { getJsonSchema } from './TableSchema';

const defaultDensity = 'low';
const initialTableLength = 10;

interface Props {
  uploadColorsManager: UseUploadColorsManager;
}

export const TableColorsUpload = (props: Props) => {
  const {
    uploadColorsManager: { colorsList, searchValue, startUpload, setSearchValue, isFinishTheUpload }
  } = props;
  const jsonschema = getJsonSchema();
  const [tableLength, setTableLength] = useState(initialTableLength);
  const [slicedData, setSliceData] = useState(colorsList.slice(0, tableLength));
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItemTo, setCurrentItemTo] = useState(tableLength);
  const [currentItemFrom, setCurrentItemFrom] = useState(1);
  const [itemsLength, setItemsLength] = useState(colorsList.length);

  const handleInputSearchChange = (e: any) => {
    const filtered = colorsList.filter(
      (item) =>
        item.colorName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        (item.variations && item.variations.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.sellers && item.sellers.toLowerCase().includes(e.target.value.toLowerCase())) ||
        item.type.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.value.toLowerCase().includes(e.target.value.toLowerCase())
    );
    console.debug(filtered);
    setSliceData(filtered.slice(0, tableLength));
    setSearchValue(e.target.value);
  };

  const clearState = () => {
    setSliceData(colorsList.slice(0, tableLength));
  };

  const handleInputSearchClear = () => {
    clearState();
  };

  useEffect(() => {
    console.debug(colorsList);
    setSliceData(colorsList.slice(0, tableLength));
    setItemsLength(colorsList.length);
    setCurrentPage(1);
    setCurrentItemTo(tableLength);
    setCurrentItemFrom(1);
  }, [colorsList]);

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    const itemFrom = currentItemTo + 1;
    const itemTo = tableLength * newPage;
    const data = colorsList.slice(itemFrom - 1, itemTo);
    goToPage(newPage, itemFrom, itemTo, data);
  };

  const handlePrevClick = () => {
    if (currentPage === 0) return;
    const newPage = currentPage - 1;
    const itemFrom = currentItemFrom - tableLength;
    const itemTo = currentItemFrom - 1;
    const data = colorsList.slice(itemFrom - 1, itemTo);
    goToPage(newPage, itemFrom, itemTo, data);
  };

  const goToPage = (
    currentPage: number,
    currentItemFrom: number,
    currentItemTo: number,
    slicedData: IColorCreationConfig[]
  ) => {
    setCurrentPage(currentPage);
    setCurrentItemFrom(currentItemFrom);
    setCurrentItemTo(currentItemTo);
    setSliceData(slicedData);
  };

  const handleRowsChange = (_e: any, value: any) => {
    setTableLength(parseInt(value));
    setCurrentItemTo(parseInt(value));
    setSliceData(colorsList.slice(0, parseInt(value)));
    setItemsLength(colorsList.length);
  };

  if (slicedData && slicedData.length <= 0) return null;

  return (
    <div className={styles.listColorTable}>
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
        onRowClick={() => {}}
        toolbar={{
          inputSearch: {
            value: searchValue,
            placeholder: 'Buscar',
            onChange: handleInputSearchChange,
            onClear: handleInputSearchClear,
            onSubmit: handleInputSearchChange
          },
          newLine: {
            label: 'Cargar',
            disabled: isFinishTheUpload,
            handleCallback: () => startUpload()
          }
        }}
      />
    </div>
  );
};
