import React, { useEffect, useState } from 'react';
import { Table } from 'vtex.styleguide';
import { SellersContext } from '../../../../../Context';
import { config, ISellersColor, UseSellersManager } from '../../../../../shared';
import { getJsonSchema } from './TableSchema';
const { useSellers } = SellersContext;

const initialTableLength = 10;
const defaultDensity = 'high';

const TableSeller = (props: { sellersManager: UseSellersManager }) => {
  const {
    sellersManager: {
      sellersList,
      runtime,
      searchValue,
      searchSellers,
      showToast,
      handleConfirmationDelete,
      setSearchValue
    }
  } = props;

  const [tableLength, setTableLength] = useState(initialTableLength);
  const [slicedData, setSliceData] = useState(sellersList.slice(0, tableLength));
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItemTo, setCurrentItemTo] = useState(tableLength);
  const [currentItemFrom, setCurrentItemFrom] = useState(1);
  const [itemsLength, setItemsLength] = useState(sellersList.length);
  const jsonschema = getJsonSchema({ slicedData, showToast, handleConfirmationDelete });

  const handleInputSearchChange = (e: any) => {
    const filtered = sellersList.filter(
      (item) =>
        item.id.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.sellerName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.sellerId.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.specificationName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    console.debug(filtered);
    setSliceData(filtered.slice(0, tableLength));
    setSearchValue(e.target.value);
  };

  const clearState = () => {
    setSearchValue('');
    setSliceData(sellersList.slice(0, tableLength));
  };

  const handleInputSearchClear = () => {
    clearState();
  };

  const handleInputSearchSubmit = (e: any) => {
    e.preventDefault();

    if (!searchValue) {
      setSearchValue('');
      searchSellers();
    } else {
      searchSellers(e.target.value);
    }
  };

  useEffect(() => {
    searchSellers();
  }, []);

  useEffect(() => {
    console.debug(sellersList);
    setSliceData(sellersList.slice(0, tableLength));
    setItemsLength(sellersList.length);
    setCurrentPage(1);
    setCurrentItemTo(tableLength);
    setCurrentItemFrom(1);
  }, [sellersList]);

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    const itemFrom = currentItemTo + 1;
    const itemTo = tableLength * newPage;
    const data = sellersList.slice(itemFrom - 1, itemTo);
    goToPage(newPage, itemFrom, itemTo, data);
  };

  const handlePrevClick = () => {
    if (currentPage === 0) return;
    const newPage = currentPage - 1;
    const itemFrom = currentItemFrom - tableLength;
    const itemTo = currentItemFrom - 1;
    const data = sellersList.slice(itemFrom - 1, itemTo);
    goToPage(newPage, itemFrom, itemTo, data);
  };

  const goToPage = (
    currentPage: number,
    currentItemFrom: number,
    currentItemTo: number,
    slicedData: ISellersColor[]
  ) => {
    setCurrentPage(currentPage);
    setCurrentItemFrom(currentItemFrom);
    setCurrentItemTo(currentItemTo);
    setSliceData(slicedData);
  };

  const handleRowsChange = (_e: any, value: any) => {
    setTableLength(parseInt(value));
    setCurrentItemTo(parseInt(value));
    setSliceData(sellersList.slice(0, parseInt(value)));
    setItemsLength(sellersList.length);
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
        onRowClick={({ rowData }: any) => {
          runtime.navigate({
            page: config.sellerDetailRoute,
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
                page: config.sellerCreationRoute
              }),
            actions: ['Recargar'].map((label) => ({
              label,
              onClick: () => {
                if (label == 'Recargar') {
                  if (searchValue) {
                    searchSellers(searchValue);
                  } else {
                    searchSellers();
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

const WrapperTableSeller = () => {
  const state = useSellers();
  if (!state) return null;

  return (
    <TableSeller
      {...{
        ...state
      }}
    />
  );
};

export default WrapperTableSeller;
