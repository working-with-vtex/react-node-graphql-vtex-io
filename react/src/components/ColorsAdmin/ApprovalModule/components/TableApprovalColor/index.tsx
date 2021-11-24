import React, { useEffect, useState } from 'react';
import { Table } from 'vtex.styleguide';
import { IColorsApproval, UseColorApprovalManager, UseColorManager } from '../../../../../shared';
import { getJsonSchema } from './TableSchema';

const initialTableLength = 10;
const defaultDensity = 'medium';

interface ITable {
  colorApprovalManager: UseColorApprovalManager;
  colorManager: UseColorManager;
}

const TableApprovalColor = (props: ITable) => {
  const {
    colorManager: { setColors },
    colorApprovalManager: {
      colorsApprovalList,
      searchValue,
      setColorApprovalToAssign,
      setIsModalAssignOpen,
      searchColorWithState,
      handleConfirmationDelete,
      showToast,
      searchColorsApproval,
      setSearchValue
    }
  } = props;
  const [tableLength, setTableLength] = useState(initialTableLength);
  const [slicedData, setSliceData] = useState(colorsApprovalList.slice(0, tableLength));
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItemTo, setCurrentItemTo] = useState(tableLength);
  const [currentItemFrom, setCurrentItemFrom] = useState(1);
  const [itemsLength, setItemsLength] = useState(colorsApprovalList.length);

  const jsonschema = getJsonSchema({
    slicedData,
    showToast,
    setColors,
    setIsModalAssignOpen,
    setColorApprovalToAssign,
    handleConfirmationDelete
  });

  const handleInputSearchChange = (e: any) => {
    const filtered = colorsApprovalList.filter(
      (item) =>
        item.id.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.specificationName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.specificationValue.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.sellerId.toLowerCase().includes(e.target.value.toLowerCase())
    );
    console.debug(filtered);
    setSliceData(filtered.slice(0, tableLength));
    setSearchValue(e.target.value);
  };

  const clearState = () => {
    setSearchValue('');
    setSliceData(colorsApprovalList.slice(0, tableLength));
  };

  const handleInputSearchClear = () => {
    clearState();
  };

  const handleInputSearchSubmit = (e: any) => {
    e.preventDefault();

    if (!searchValue) {
      setSearchValue('');
      searchColorsApproval();
    } else {
      searchColorsApproval(e.target.value);
    }
  };

  useEffect(() => {
    searchColorsApproval();
  }, []);

  useEffect(() => {
    console.debug(colorsApprovalList);
    setSliceData(colorsApprovalList.slice(0, tableLength));
    setItemsLength(colorsApprovalList.length);
    setCurrentPage(1);
    setCurrentItemTo(tableLength);
    setCurrentItemFrom(1);
  }, [colorsApprovalList]);

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    const itemFrom = currentItemTo + 1;
    const itemTo = tableLength * newPage;
    const data = colorsApprovalList.slice(itemFrom - 1, itemTo);
    goToPage(newPage, itemFrom, itemTo, data);
  };

  const handlePrevClick = () => {
    if (currentPage === 0) return;
    const newPage = currentPage - 1;
    const itemFrom = currentItemFrom - tableLength;
    const itemTo = currentItemFrom - 1;
    const data = colorsApprovalList.slice(itemFrom - 1, itemTo);
    goToPage(newPage, itemFrom, itemTo, data);
  };

  const goToPage = (
    currentPage: number,
    currentItemFrom: number,
    currentItemTo: number,
    slicedData: IColorsApproval[]
  ) => {
    setCurrentPage(currentPage);
    setCurrentItemFrom(currentItemFrom);
    setCurrentItemTo(currentItemTo);
    setSliceData(slicedData);
  };

  const handleRowsChange = (_e: any, value: any) => {
    setTableLength(parseInt(value));
    setCurrentItemTo(parseInt(value));
    setSliceData(colorsApprovalList.slice(0, parseInt(value)));
    setItemsLength(colorsApprovalList.length);
  };

  return (
    <div>
      <Table
        onRowClick={() => {}}
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
        toolbar={{
          inputSearch: {
            value: searchValue,
            placeholder: 'Buscar',
            onChange: handleInputSearchChange,
            onClear: handleInputSearchClear,
            onSubmit: handleInputSearchSubmit
          },
          newLine: {
            label: 'Actualizar',
            handleCallback: () => {
              if (searchValue) {
                searchColorsApproval(searchValue);
              } else {
                searchColorsApproval();
              }
            },
            actions: ['Filtrar por: Pendientes', 'Filtrar por: Asignados'].map((label) => ({
              label,
              onClick: () => {
                if (label == 'Filtrar por: Pendientes') {
                  searchColorWithState('pending');
                }
                if (label == 'Filtrar por: Asignados') {
                  searchColorWithState('assigned');
                }
              }
            }))
          }
        }}
      />
    </div>
  );
};

export default TableApprovalColor;
