import * as FileSaver from 'file-saver';
import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useRuntime } from 'vtex.render-runtime';
import * as XLSX from 'xlsx';
import {
  COLORS_ACRONYM,
  COLOR_FIELDS,
  config,
  FinishCreateColor,
  IColorCreation,
  IColors,
  IDeleteColor,
  KEY_SEARCH,
  ShowToastParams,
  SORT_COLOR_KEY_SEARCH,
  UseColorManager
} from '..';
import CreateColor from '../../graphql/mutations/CreateColor.graphql';
import DeleteColor from '../../graphql/mutations/DeleteColor.graphql';
import UpdateColorById from '../../graphql/mutations/UpdateColorById.graphql';
import SearchColorById from '../../graphql/queries/SearchColorById.graphql';
import SearchColors from '../../graphql/queries/SearchColors.graphql';
import { BulkActions, FinishDeleteColors } from '../models';

const LIST_ERRORS = [
  'Se ha presentado un error',
  'valida la información del color para no generar registros duplicados'
];

// Configuración del archivo a descargar para los colores
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

export const useColorManager = ({ showToast }: { showToast: (params: ShowToastParams) => void }) => {
  const [
    makeColorSearch,
    { loading: loadingColors, data: dataColor, error: errorColor }
  ] = useLazyQuery(SearchColors, { partialRefetch: true, fetchPolicy: 'no-cache' });
  const [
    makeColorSearchById,
    { loading: loadingColorsId, data: dataColorId, error: errorColorId }
  ] = useLazyQuery(SearchColorById, { partialRefetch: true, fetchPolicy: 'no-cache' });

  // Action to UpdateColorById
  const [changeColorByIdState, mutationColorByIdState] = useMutation(UpdateColorById);
  // Action to CreateColor
  const [createColorState, mutationCreateColorState] = useMutation(CreateColor);
  // Action to DeleteColor
  const [deleteColorState, mutationDeleteColorState] = useMutation(DeleteColor);

  const [colors, setColors] = useState<IColors[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [loadingQuery, setLoadingQuery] = useState(true);
  const [errorOnGetColors, setErrorOnGetColors] = useState(false);
  const [colorById, setColorById] = useState<IColors | null>(null);
  const [tempColor, setTempColor] = useState<IColors | null>(null);
  const [getColorsDuplicate, setGetColorsDuplicate] = useState(0);
  // State on Create the color
  const [finishOnCreateColor, setFinishOnCreateColor] = useState<FinishCreateColor | null>(null);
  // Progress control
  const [totalOfItemsPrevToDelete, setTotalOfItemsPrevToDelete] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [finishOnDeleteColor, setFinishOnDeleteColor] = useState<FinishDeleteColors | null>(null);
  const [isFinishTheDelete, setIsFinishTheDelete] = useState(false);
  const [currentColorToDelete, setCurrentColorToDelete] = useState<IColors | null>(null);
  const [hasBeenStartDelete, setHasBeenStartDelete] = useState(false);
  const [colorsToDelete, setColorsToDelete] = useState<IColors[]>([]);
  const [colorsTotalToDelete, setColorsTotalToDelete] = useState<IColors[]>([]);
  const [stopDeleteColor, setStopDeleteColor] = useState(false);
  const [colorInformationToDelete, setColorInformationToDelete] = useState<IDeleteColor | null>(null);

  const runtime = useRuntime();

  const handleReset = (getResults?: boolean) => {
    console.log('Call Reset HANDLER');
    setStopDeleteColor(false);
    setIsFinishTheDelete(false);
    setColorInformationToDelete(null);
    setStepProgress(0);
    setTotalOfItemsPrevToDelete(0);
    setCurrentColorToDelete(null);
    setHasBeenStartDelete(false);

    setColors([]);
    setColorsToDelete([]);
    setColorsTotalToDelete([]);
    if (getResults) {
      searchColors();
    }
    setFinishOnDeleteColor(null);
  };

  useEffect(() => {
    if (colors && colors.length) {
      let searchDuplicate: IColors[] = [];
      colors.filter((item) => {
        if (
          colors.find((find) => find.colorName == item.colorName && find.idMasterData != item.idMasterData)
        ) {
          searchDuplicate.push(item);
          return true;
        } else {
          return false;
        }
      });
      console.debug(searchDuplicate);

      setGetColorsDuplicate(searchDuplicate.length);
    } else {
      setGetColorsDuplicate(0);
    }
  }, [colors]);

  // Wath que esta pendiente del proceso de subida de colores
  useEffect(() => {
    if (!stopDeleteColor) {
      if (finishOnDeleteColor && finishOnDeleteColor.color && currentColorToDelete) {
        console.debug(finishOnDeleteColor, currentColorToDelete);
        console.debug(finishOnDeleteColor.color.colorName, currentColorToDelete.colorName);

        if (
          !finishOnDeleteColor.finish &&
          finishOnDeleteColor.color.idMasterData == currentColorToDelete.idMasterData
        ) {
          incrementProgress();

          // Proceso encargado de ejecutar el siguiente item para realizar la creación
          const nexItem = finishOnDeleteColor.position + 1;

          console.debug(nexItem);
          console.debug(colors);

          if (colors.length && colors[nexItem] && colors[nexItem]) {
            // Guardo el template a Eliminar
            setColorInformationToDelete({
              id: colors[nexItem].idMasterData,
              index: nexItem
            });
            runDeleteColors(nexItem, colors);
          } else {
            showToast({
              message: `Se han eliminado los registros correctamente`,
              duration: 10000
            });

            // Realizo nuevamente la busqueda de registros para estar seguros de que se han eliminado la totalidad de elementos
            handleReset(true);
          }
        }
      }
    } else {
      console.debug('Reset delete');
      handleReset(true);
    }
  }, [finishOnDeleteColor, stopDeleteColor]);

  // Mutations watchers

  useEffect(() => {
    if (!mutationColorByIdState.loading) {
      if (mutationColorByIdState.data) {
        console.debug(mutationColorByIdState);

        const { message, status } = mutationColorByIdState.data.updateColorById;

        if (status == 200) {
          setColorById(tempColor);
        }

        showToast({
          message,
          duration: 6000
        });
      }
    }
  }, [mutationColorByIdState]);

  useEffect(() => {
    if (!mutationDeleteColorState.loading) {
      if (mutationDeleteColorState.data) {
        console.debug(mutationDeleteColorState);

        const { message } = mutationDeleteColorState.data.deleteColor;
        console.log(colorInformationToDelete);
        console.log(colorsToDelete);
        console.log(finishOnDeleteColor);

        // Obtengo el color seleccionado para la eliminación, y valido si aún quedan elementos  por eliminar
        if (colorInformationToDelete && colorsToDelete.length) {
          // Busco el index del elemento a eliminar
          var index = colorsToDelete
            .map((x) => {
              return x.idMasterData;
            })
            .indexOf(colorInformationToDelete.id);

          console.log(index);

          const newColorInformation = Object.assign([], colorsToDelete);
          // Remuevo el elemento
          newColorInformation.splice(index, 1);
          console.log(newColorInformation);

          // Actualizó la lista de registros disponbiles por borrar
          setColorsToDelete(newColorInformation);
          if (!hasBeenStartDelete) {
            setColors(newColorInformation);
          }
        } else {
          // Detengo el proceso de eliminación cuando no hay mas elementos a eliminar
          setStopDeleteColor(true);
        }

        if (finishOnDeleteColor && finishOnDeleteColor.color) {
          const finishUpload = Object.assign({}, finishOnDeleteColor);
          finishUpload.finish = true;
          console.log('Set finish the current color');
          console.log(finishUpload);
          setFinishOnDeleteColor(finishUpload);
        } else {
          showToast({
            message,
            duration: 3000
          });
          if (searchValue) {
            searchColors(searchValue);
          } else {
            searchColors();
          }
        }
      }
    }
  }, [mutationDeleteColorState]);

  useEffect(() => {
    if (!mutationCreateColorState.loading) {
      if (mutationCreateColorState.data) {
        console.debug(mutationCreateColorState);
        const { message } = mutationCreateColorState.data.createColor;
        // Actualizo el color que se estaba actualizando, para así notificar a quien este interesado de escuchar el cambio
        console.debug(finishOnCreateColor, message);

        if (finishOnCreateColor && finishOnCreateColor.color) {
          const finishUpload = Object.assign({}, finishOnCreateColor);
          finishUpload.finish = true;

          finishUpload.log = {
            colorPosition: finishUpload.position,
            color: finishUpload.color,
            message
          };

          setFinishOnCreateColor(finishUpload);
        } else {
          showToast({
            message,
            duration: 3000
          });

          console.log(runtime);
          const haveErrorOnCreate = LIST_ERRORS.find((item) => message.includes(item));
          if (runtime && runtime.page == config.colorCreationRoute && !haveErrorOnCreate) {
            setTimeout(() => {
              runtime.navigate({
                page: config.colorListRoute
              });
            }, 1000);
          }
        }
      }
    }
  }, [mutationCreateColorState]);

  // Query watcher

  useEffect(() => {
    setLoadingQuery(true);

    if (errorColor) {
      setColors([]);
      setLoadingQuery(false);
      setErrorOnGetColors(true);
    }
    if (!loadingColors) {
      if (dataColor && dataColor.searchColors && dataColor.searchColors.data.colors) {
        setErrorOnGetColors(false);
        setLoadingQuery(false);
        const colorsList = dataColor.searchColors.data.colors;
        // Agrego una copia del id, al usar el componente de la tabla de vtex para seleccionar que elementos quiero eliminar, este esta sobre escribiendo la key id por lo que se pierde el id
        colorsList.map((item) => {
          item.idMasterData = item.id;
        });
        setColors(colorsList);
      } else {
        setLoadingQuery(false);
      }
    }
  }, [dataColor, loadingColors, errorColor]);

  useEffect(() => {
    setLoadingQuery(true);

    if (errorColorId) {
      setColorById(null);
      setLoadingQuery(false);
      setErrorOnGetColors(true);
    } else if (!loadingColorsId) {
      if (dataColorId && dataColorId.searchColorById && dataColorId.searchColorById.data.color) {
        setErrorOnGetColors(false);
        setLoadingQuery(false);
        const colorDetail = dataColorId.searchColorById.data.color;
        setColorById(colorDetail);
      } else {
        setLoadingQuery(false);
      }
    }
  }, [dataColorId, errorColorId, loadingColorsId]);

  // Mutation Handlers

  const saveChangesColorById = (color: IColors) => {
    changeColorByIdState({ variables: { color, colorsAcronym: COLORS_ACRONYM } });
  };

  const handlerCreateColor = (color: IColorCreation) => {
    createColorState({ variables: { color, colorsAcronym: COLORS_ACRONYM } });
  };

  const handlerDeleteColor = (color: IDeleteColor) => {
    deleteColorState({ variables: { id: color.id, colorsAcronym: COLORS_ACRONYM } });
  };

  // Basic handlers, Alerts And dialog
  const handleConfirmationDelete = (color: IDeleteColor) => {
    if (color) {
      handlerDeleteColor(color);
    } else {
      showToast({
        message: 'Se ha presentado un problema al eliminar el color',
        duration: 3000
      });
    }
  };

  // Query Handlers
  const searchColors = (param?: string) => {
    setColors([]);
    if (param) {
      makeColorSearch({
        variables: {
          filter: `${config.searchColorApi}${KEY_SEARCH}${param}${SORT_COLOR_KEY_SEARCH}`
        }
      });
    } else {
      makeColorSearch({
        variables: {
          filter: `${config.searchColorApi}${SORT_COLOR_KEY_SEARCH}`
        }
      });
    }
  };

  const searchColorsById = (id: string) => {
    makeColorSearchById({
      variables: {
        id: `${config.getColorById}${id}${COLOR_FIELDS}`
      }
    });
  };

  const incrementProgress = () => {
    const listElements = colorsTotalToDelete.length;
    const itemValueProgress = 100 / listElements;
    let countProgress = stepProgress;
    countProgress = countProgress + itemValueProgress;
    setStepProgress(countProgress);
  };

  const handlerDeleteColors = (information: BulkActions) => {
    console.log(information);
    console.log(colors);

    if (information.allLinesSelected) {
      console.log('Pass to delete all colors');
      setColorsToDelete(colors);
      setColorsTotalToDelete(colors);
      startUpload(colors);
    } else if (information.selectedRows && information.selectedRows.length) {
      setColorsToDelete(information.selectedRows);
      setColorsTotalToDelete(information.selectedRows);
      startUpload(information.selectedRows);

      console.log('Pass to delete the selected colors');
    } else {
      showToast({ message: 'Se ha presentado un error al eliminar los elementos', duration: 3000 });
    }
  };

  const startUpload = (colorsToDelete: IColors[]) => {
    // Indico que se inicio el proceso de subida de archivos
    setIsFinishTheDelete(true);
    // Reinicio el contador del progress
    setStepProgress(0);
    // Guardo el color que se esta subiendo en este momento
    setCurrentColorToDelete(colorsToDelete[0]);
    setColorInformationToDelete({
      id: colorsToDelete[0].idMasterData,
      index: 0
    });
    // Inicio el proceso de subida del color en la posición 0
    runDeleteColors(0, colorsToDelete);
    setTotalOfItemsPrevToDelete(colorsToDelete.length);
    // Indico que se estan subiendo los archivos y se muestra el progress component
    setHasBeenStartDelete(true);
  };

  const runDeleteColors = (position: number, colorsToDelete: IColors[]) => {
    const color = colorsToDelete[position];
    console.log(color);

    if (color && color.idMasterData) {
      setCurrentColorToDelete(color);
      console.log(color, position);
      handlerDeleteColor({ id: color.idMasterData, index: position });
      setFinishOnDeleteColor({
        finish: false,
        color: color,
        position: position
      });
    } else {
      handleReset(true);
    }
  };

  const downloadXlsFileWithColors = () => {
    if (colors.length) {
      // Remove keys from the final array
      let newArray: any = JSON.parse(JSON.stringify(colors));
      newArray.map((item: any) => {
        delete item.id;
        delete item.idMasterData;
        delete item.creationDate;
        delete item.__typename;
      });
      const ws = XLSX.utils.json_to_sheet(newArray);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, 'Colors' + '.xlsx');
    } else {
      showToast({ message: 'No se poseen registros', duration: 3000 });
    }
  };

  const ContextProps: UseColorManager = useMemo(() => {
    return {
      colors,
      loadingQuery,
      errorOnGetColors,
      runtime,
      colorById,
      tempColor,
      finishOnCreateColor,
      searchValue,
      getColorsDuplicate,
      hasBeenStartDelete,
      stepProgress,
      colorsToDelete,
      isFinishTheDelete,
      totalOfItemsPrevToDelete,
      setStopDeleteColor,
      downloadXlsFileWithColors,
      setStepProgress,
      handlerDeleteColors,
      showToast,
      setFinishOnCreateColor,
      setSearchValue,
      handleConfirmationDelete,
      searchColors,
      searchColorsById,
      setColorById,
      setTempColor,
      saveChangesColorById,
      handlerCreateColor,
      setColors
    };
  }, [
    colors,
    loadingQuery,
    errorOnGetColors,
    runtime,
    colorById,
    tempColor,
    finishOnCreateColor,
    searchValue,
    getColorsDuplicate,
    hasBeenStartDelete,
    stepProgress,
    colorsToDelete,
    isFinishTheDelete,
    totalOfItemsPrevToDelete
  ]);

  return ContextProps;
};
