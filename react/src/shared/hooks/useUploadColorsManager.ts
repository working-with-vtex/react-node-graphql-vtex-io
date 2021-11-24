import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useRuntime } from 'vtex.render-runtime';
import * as XLSX from 'xlsx';
import { IColorCreationConfig, ILogsCapture, IUploadColorManager, UseUploadColorsManager } from '..';

export const useUploadColorsManager = (props: IUploadColorManager) => {
  const { showToast, finishOnCreateColor, handlerCreateColor, setFinishOnCreateColor } = props;
  const intl = useIntl();
  const runtime = useRuntime();
  const [files, setFiles] = useState<any>(null);
  const [isLoadingUploadFile, setIsLoadingUploadFile] = useState(false);
  const [errorOnReadFile, setErrorOnReadFile] = useState(false);
  const [colorsList, setColorsList] = useState<IColorCreationConfig[]>([]);
  const [result, setResult] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [stepProgress, setStepProgress] = useState(0);
  const [isFinishTheUpload, setIsFinishTheUpload] = useState(false);
  const [hasBeenStartUpload, setHasBeenStartUpload] = useState(false);
  const [currentColorToUpload, setCurrentColorToUpload] = useState<IColorCreationConfig | null>(null);
  const [listLogs, setListLogs] = useState<ILogsCapture[]>([]);
  // Modal Dialog state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stopDeleteColor, setStopDeleteColor] = useState(false);

  // Wath que esta pendiente del proceso de subida de colores
  useEffect(() => {
    if (!stopDeleteColor) {
      if (finishOnCreateColor && finishOnCreateColor.color && currentColorToUpload) {
        console.debug(finishOnCreateColor, currentColorToUpload);
        console.debug(finishOnCreateColor.color.colorName, currentColorToUpload.colorName);

        if (
          finishOnCreateColor.finish &&
          finishOnCreateColor.color.colorName == currentColorToUpload.colorName
        ) {
          incrementProgress();

          const logs = Object.assign([], listLogs);
          if (finishOnCreateColor.log && finishOnCreateColor.log.message != '') {
            console.debug(finishOnCreateColor);

            logs.push(finishOnCreateColor.log);
            setListLogs(logs);
          }

          // Proceso encargado de ejecutar el siguiente item para realizar la creación
          const nexItem = finishOnCreateColor.position + 1;

          if (nexItem < colorsList.length) {
            runUploadColor(nexItem);
          } else {
            console.debug(logs);

            if (logs.length) {
              showToast({
                message: `Verifica los logs capturados en la opción "Ver logs"`,
                duration: 10000
              });
            }
            setIsFinishTheUpload(false);
          }
        }
      }
    } else {
      handleReset();
    }
  }, [finishOnCreateColor, stopDeleteColor]);

  const getDate = () => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Clear the current information
  const handleReset = () => {
    console.debug(files);
    setColorsList([]);
    setResult(null);
    setFiles(null);
    setIsLoadingUploadFile(false);
    setErrorOnReadFile(false);
    setIsFinishTheUpload(false);
    setHasBeenStartUpload(false);
    setCurrentColorToUpload(null);
    setFinishOnCreateColor(null);
    setListLogs([]);
  };

  const handleFile = (files: any) => {
    if (files && files.length) {
      if (files[0] && files[0].path.includes('xls')) {
        readXls(files);
      } else if (files[0] && files[0].path.includes('json')) {
        readJson(files);
      } else {
        handleReset();
        setErrorOnReadFile(true);
      }
    }
    setResult(files);
  };

  const readJson = (files: any) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const text: any = reader.result;
      if (JSON.parse(text).colors) {
        setReaderFile(JSON.parse(text).colors);
      }
    };
    reader.readAsText(files[0]);
  };

  const formatFile = (file: any) => {
    const formatted = JSON.parse(JSON.stringify(file));
    formatted.map((item: any) => {
      if (item.type) {
        item.type = item.type.toLowerCase();
      }
      if (item.isLight) {
        item.isLight = item.isLight.toLowerCase();
      }
      return item;
    });
    return formatted;
  };

  const readXls = (files: any) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(files[0]);
    reader.onloadend = (e: any) => {
      let data = new Uint8Array(e.target.result);
      let workbook = XLSX.read(data, { type: 'array' });
      let XL_row_object: any = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      setReaderFile(formatFile(XL_row_object));
    };
  };

  const incrementProgress = () => {
    const listElements = colorsList.length;
    const itemValueProgress = 100 / listElements;
    let countProgress = stepProgress;
    countProgress = countProgress + itemValueProgress;
    setStepProgress(countProgress);
  };

  const mapColorsFromFile = (colors: IColorCreationConfig[]) => {
    let haveErrors = false;
    const mappedColors = colors.map((item, index: number) => {
      if (!haveErrors) {
        if (!item.sellers) {
          item.sellers = '';
        }
        if (!item.variations) {
          item.variations = '';
        }
        if (!item.isLight) {
          item.isLight = false;
        }

        if (item.isLight) {
          item.isLight = Boolean(item.isLight);
        }

        item.creationDate = getDate();

        // Valida si los siguientes campos tienen información, sin estos valores el color no se debería de poder crear
        if (!item.colorName || !item.type || !item.value) {
          haveErrors = true;

          let message = '';
          if (!item.colorName) {
            message += 'Nombre';
          }
          if (!item.type) {
            message += `${message != '' ? ',' : ''}Tipo`;
          }
          if (!item.value) {
            message += `${message != '' ? ',' : ''}Valor`;
          }

          showToast({
            message: `Verifica la información del ${
              index + 1
            } elemento del archivo, Los siguientes elementos se encuentran erróneos: ${message}`,
            duration: 3000
          });
          handleReset();
        }

        const o = Object.assign({}, item);
        return o;
      } else {
        return item;
      }
    });

    return {
      haveErrors,
      mappedColors
    };
  };

  /**
   * Método encargado de leer la información del archivo y validar que contenga los datos correctos
   * @param colors
   */
  const setReaderFile = (colors: IColorCreationConfig[]) => {
    if (colors && colors.length) {
      const { mappedColors, haveErrors } = mapColorsFromFile(colors);

      if (!haveErrors) {
        setErrorOnReadFile(false);
        setColorsList(mappedColors);
      }
    } else {
      setErrorOnReadFile(true);
    }
  };

  const startUpload = () => {
    setListLogs([]);
    // Indico que se inicio el proceso de subida de archivos
    setIsFinishTheUpload(true);
    // Reinicio el contador del progress
    setStepProgress(0);
    // Guardo el color que se esta subiendo en este momento
    setCurrentColorToUpload(colorsList[0]);
    // Inicio el proceso de subida del color en la posición 0
    runUploadColor(0);
    // Indico que se estan subiendo los archivos y se muestra el progress component
    setHasBeenStartUpload(true);
  };

  const runUploadColor = (position: number) => {
    const color = colorsList[position];
    setFinishOnCreateColor({
      finish: false,
      color: color,
      position: position,
      log: {
        color,
        message: '',
        colorPosition: position
      }
    });
    setCurrentColorToUpload(color);

    handlerCreateColor(color);
  };

  const ContextProps: UseUploadColorsManager = useMemo(() => {
    return {
      intl,
      isFinishTheUpload,
      hasBeenStartUpload,
      searchValue,
      isLoadingUploadFile,
      colorsList,
      runtime,
      stepProgress,
      isModalOpen,
      listLogs,
      errorOnReadFile,
      result,
      setIsModalOpen,
      setStopDeleteColor,
      startUpload,
      handleFile,
      handleReset,
      showToast,
      setSearchValue,
      setStepProgress
    };
  }, [
    intl,
    isFinishTheUpload,
    hasBeenStartUpload,
    searchValue,
    isLoadingUploadFile,
    colorsList,
    runtime,
    isModalOpen,
    listLogs,
    stepProgress,
    errorOnReadFile,
    result
  ]);
  return ContextProps;
};
