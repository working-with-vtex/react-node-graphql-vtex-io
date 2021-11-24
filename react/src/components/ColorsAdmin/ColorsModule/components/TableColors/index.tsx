import React, { useEffect, useState } from 'react';
import { IconInfo, InputSearch, Table, EXPERIMENTAL_Select as Select } from 'vtex.styleguide';
import { config, IColors, UseColorManager } from '../../../../../shared';
import styles from './index.css';
import { getJsonSchema } from './TableSchema';

const initialTableLength = 10;
const defaultDensity = 'medium';
const options = [
  {
    value: 10,
    label: 10
  },
  {
    value: 15,
    label: 15
  },
  {
    value: 25,
    label: 25
  }
];

const TableColors = (props: { colorManager: UseColorManager }) => {
  const {
    colorManager: {
      colors,
      runtime,
      getColorsDuplicate,
      searchValue,
      downloadXlsFileWithColors,
      searchColors,
      handleConfirmationDelete,
      handlerDeleteColors,
      setSearchValue,
      showToast
    }
  } = props;
  console.log(colors);

  const [tableLength, setTableLength] = useState(initialTableLength);
  const [slicedData, setSliceData] = useState(colors.slice(0, tableLength));
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItemTo, setCurrentItemTo] = useState(tableLength);
  const [currentItemFrom, setCurrentItemFrom] = useState(1);
  const [itemsLength, setItemsLength] = useState(colors.length);
  const [defaultSelectOption, setDefaultSelectOption] = useState({
    value: initialTableLength,
    label: initialTableLength
  });
  let jsonschema = getJsonSchema({ slicedData, handleConfirmationDelete, showToast });

  useEffect(() => {
    jsonschema = getJsonSchema({ slicedData, handleConfirmationDelete, showToast });
  }, [colors]);

  const handleInputSearchChange = (e: any) => {
    const filtered = colors.filter(
      (item) =>
        (item.colorName && item.colorName.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.variations && item.variations.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.value && item.value.toLowerCase().includes(e.target.value.toLowerCase()))
    );
    console.debug(filtered);
    setSliceData(filtered.slice(0, tableLength));
    setSearchValue(e.target.value);
  };

  const clearState = () => {
    setSearchValue('');
    setSliceData(colors.slice(0, tableLength));
  };

  const handleInputSearchClear = () => {
    clearState();
  };

  const handleInputSearchSubmit = (e: any) => {
    e.preventDefault();

    if (!searchValue) {
      setSearchValue('');
      searchColors();
    } else {
      searchColors(e.target.value);
    }
  };

  useEffect(() => {
    searchColors();
  }, []);

  useEffect(() => {
    console.debug(colors);
    setSliceData(colors.slice(0, tableLength));
    setCurrentItemTo(tableLength);
    setItemsLength(colors.length);
    setCurrentPage(1);
    setCurrentItemFrom(1);
  }, [colors]);

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    const itemFrom = currentItemTo + 1;
    const itemTo = tableLength * newPage;
    const data = colors.slice(itemFrom - 1, itemTo);
    goToPage(newPage, itemFrom, itemTo, data);
  };

  const handlePrevClick = () => {
    if (currentPage === 0) return;
    const newPage = currentPage - 1;
    const itemFrom = currentItemFrom - tableLength;
    const itemTo = currentItemFrom - 1;
    const data = colors.slice(itemFrom - 1, itemTo);
    goToPage(newPage, itemFrom, itemTo, data);
  };

  const goToPage = (
    currentPage: number,
    currentItemFrom: number,
    currentItemTo: number,
    slicedData: IColors[]
  ) => {
    setCurrentPage(currentPage);
    setCurrentItemFrom(currentItemFrom);
    setCurrentItemTo(currentItemTo);
    setSliceData(slicedData);
  };

  const handleRowsChange = (_e: any, value: any) => {
    console.log(value);
    setItemsLength(colors.length);
    setSliceData(colors.slice(0, parseInt(value)));
    setTableLength(parseInt(value));
    setCurrentItemTo(parseInt(value));
    setDefaultSelectOption({
      value,
      label: value
    });
  };

  const CustomTable = () => {
    return (
      <div className={styles.tableContainer}>
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
            textOf: 'de',
            totalItems: itemsLength
          }}
          onRowClick={({ rowData }: { rowData: IColors }) => {
            runtime.navigate({
              page: config.colorDetailRoute,
              params: { id: rowData.idMasterData }
            });
          }}
          totalizers={[
            {
              label: 'Colores Duplicados',
              value: getColorsDuplicate,
              iconBackgroundColor: 'red',
              icon: <IconInfo color="#fff" size={20} />
            }
          ]}
          toolbar={{
            newLine: {
              label: 'Nuevo',
              handleCallback: () =>
                runtime.navigate({
                  page: config.colorCreationRoute
                }),
              actions: ['Recargar', 'Descargar xls'].map((label) => ({
                label,
                onClick: () => {
                  if (label == 'Recargar') {
                    if (searchValue) {
                      searchColors(searchValue);
                    } else {
                      searchColors();
                    }
                  }
                  if (label == 'Descargar xls') {
                    downloadXlsFileWithColors();
                  }
                }
              }))
            }
          }}
          bulkActions={{
            texts: {
              rowsSelected: (qty) => <React.Fragment>Filas seleccionadas: {qty}</React.Fragment>,
              selectAll: 'Seleccionar todo',
              allRowsSelected: (qty) => <React.Fragment>Todas las filas seleccionadas: {qty}</React.Fragment>
            },
            totalItems: 122,
            onChange: (params) => console.debug(params),
            main: {
              label: 'Eliminar',
              handleCallback: (params) => {
                showToast({
                  message: 'Esta seguro de eliminar los registros seleccionados, ¿esta seguro de continuar?',
                  action: {
                    label: 'Eliminar',
                    onClick: () => {
                      handlerDeleteColors(params);
                    }
                  }
                });
              }
            }
          }}
        />
        <div className={styles.selectTableOption}>
          <Select
            label={'Mostrar filas'}
            options={options}
            multi={false}
            size="small"
            clearable={false}
            noOptionsMessage={() => 'No hay opciones'}
            value={defaultSelectOption}
            onChange={(values) => {
              console.log(values);
              handleRowsChange(null, values.value);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.containerTable}>
      <div className={styles.searchInput}>
        <InputSearch
          placeholder="Buscar..."
          value={searchValue}
          size="regular"
          onClear={handleInputSearchClear}
          onChange={handleInputSearchChange}
          onSubmit={handleInputSearchSubmit}
        />
      </div>
      {/* Se realiza esta validación para forzar el renderizado nuevamente de la tabla */}
      {!colors.length ? <CustomTable /> : <CustomTable />}
    </div>
  );
};

export default TableColors;
