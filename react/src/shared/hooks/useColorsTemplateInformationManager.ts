import * as FileSaver from 'file-saver';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useMutation } from 'react-apollo';
import * as XLSX from 'xlsx';
import {
  config,
  FinishDeleteTemplate,
  IColorsTemplateInformation,
  IColorsTemplateInformationManager,
  IDeleteTemplateInformation,
  KEY_SEARCH,
  TEMPLATE_ACRONYM,
  TEMPLATE_INFORMATION_ACRONYM,
  UseColorsTemplateInformationManager
} from '..';
import DeleteTemplateInformation from '../../graphql/mutations/DeleteTemplateInformation.graphql';
import UpdateTemplateInformation from '../../graphql/mutations/UpdateTemplateInformation.graphql';
import RunJobSearchSpecifications from '../../graphql/mutations/RunJobSearchSpecifications.graphql';
import SearchColorsTemplateInformation from '../../graphql/queries/SearchColorsTemplateInformation.graphql';
import { FILTER_BY_TEMPLATE_ID_SEARCH, SORT_COLOR_TEMPLATE_INFORMATION_KEY_SEARCH } from '../const';
import { IAssignColorTemplate, IColors } from '../models';

// Configuración del archivo a descargar para los templates
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

export const useColorsTemplateInformationManager = (props: IColorsTemplateInformationManager) => {
  const {
    colorsTemplateManager: { templateId, templateById, temporalTemplateId, showToast, searchTemplateById }
  } = props;

  // Query
  const [
    makeTemplateSearchTemplateInformation,
    { loading: loadingTemplateInformation, data: dataTemplateInformation, error: errorTemplateInformation }
  ] = useLazyQuery(SearchColorsTemplateInformation, { partialRefetch: true, fetchPolicy: 'no-cache' });

  // Mutation
  const [deleteTemplateInformationState, mutationDeleteTemplateInformationState] = useMutation(
    DeleteTemplateInformation
  );
  const [updateTemplateInformationState, mutationUpdateTemplateInformationState] = useMutation(
    UpdateTemplateInformation
  );
  const [runJobSearchSpecificationsState, mutationRunJobSearchSpecificationsState] = useMutation(
    RunJobSearchSpecifications
  );

  // State Hook
  const [templatesInformation, setTemplatesInformation] = useState<IColorsTemplateInformation[]>([]);
  const [templatesInformationWithDelete, setTemplatesInformationWithDelete] = useState<
    IColorsTemplateInformation[]
  >([]);
  const [searchValueInformation, setSearchValueInformation] = useState('');
  const [loadingQueryInformation, setLoadingQueryInformation] = useState(true);
  const [errorOnGetTemplatesInformation, setErrorOnGetTemplatesInformation] = useState(false);
  const [
    templateInformationToDelete,
    setTemplateInformationToDelete
  ] = useState<IDeleteTemplateInformation | null>(null);
  const [stepProgress, setStepProgress] = useState(0);
  const [
    finishOnDeleteTemplateInformation,
    setFinishOnDeleteTemplateInformation
  ] = useState<FinishDeleteTemplate | null>(null);
  const [
    currentTemplateInformationToDelete,
    setCurrentTemplateInformationToDelete
  ] = useState<IColorsTemplateInformation | null>(null);
  const [isFinishTheUpload, setIsFinishTheUpload] = useState(false);
  const [hasBeenStartUpload, setHasBeenStartUpload] = useState(false);
  const [totalOfItemsPrevToDelete, setTotalOfItemsPrevToDelete] = useState(0);
  const [stopDeleteTemplateInformation, setStopDeleteTemplateInformation] = useState(false);
  const [getTemplateItemsDuplicate, setGetTemplateItemsDuplicate] = useState(0);
  const [getTemplateItemsWithoutValue, setGetTemplateItemsWithoutValue] = useState(0);
  const [haveTemplateWithoutDuplicate, setHaveTemplateWithoutDuplicate] = useState<
    IColorsTemplateInformation[]
  >([]);

  // Modal Dialog Assign
  const [isModalAssignOpen, setIsModalAssignOpen] = useState(false);
  const [loadingAssignDialog, setLoadingAssignDialog] = useState(false);
  const [colorTemplateToAssign, setColorTemplateToAssign] = useState<IAssignColorTemplate | null>(null);
  const [colorToUseInTheAssignation, setColorToUseInTheAssignation] = useState<IColors | null>(null);

  useEffect(() => {
    if (templatesInformation && templatesInformation.length) {
      let searchDuplicate: IColorsTemplateInformation[] = [];
      templatesInformation.filter((item) => {
        if (templatesInformation.find((find) => find.variations == item.variations && find.id != item.id)) {
          searchDuplicate.push(item);
          return true;
        } else {
          return false;
        }
      });
      console.debug(searchDuplicate);

      setGetTemplateItemsDuplicate(searchDuplicate.length);
    } else {
      setGetTemplateItemsDuplicate(0);
    }

    if (templatesInformation && templatesInformation.length) {
      let searchWithoutValue: IColorsTemplateInformation[] = [];
      templatesInformation.filter((item) => {
        if (templatesInformation.find((find) => find.colorName == '' || find.value == '')) {
          searchWithoutValue.push(item);
          return true;
        } else {
          return false;
        }
      });
      setGetTemplateItemsWithoutValue(searchWithoutValue.length);
    } else {
      setGetTemplateItemsWithoutValue(0);
    }
  }, [templatesInformation]);

  // Watch que esta pendiente del proceso de eliminación de templates Information
  useEffect(() => {
    console.debug(stopDeleteTemplateInformation);

    if (!stopDeleteTemplateInformation) {
      if (
        finishOnDeleteTemplateInformation &&
        finishOnDeleteTemplateInformation.template &&
        currentTemplateInformationToDelete
      ) {
        console.debug(finishOnDeleteTemplateInformation, currentTemplateInformationToDelete);
        console.debug(finishOnDeleteTemplateInformation.template.id, currentTemplateInformationToDelete.id);

        // Si el elmento pasado coincide con el actual que se esta elminando
        if (
          finishOnDeleteTemplateInformation.finish &&
          finishOnDeleteTemplateInformation.template.id == currentTemplateInformationToDelete.id
        ) {
          incrementProgress();

          // Proceso encargado de ejecutar el siguiente item para realizar la creación
          const nexItem = finishOnDeleteTemplateInformation.position + 1;

          console.debug(nexItem);
          console.debug(templatesInformation);

          if (templatesInformation.length && templatesInformation[nexItem] && templatesInformation[nexItem]) {
            // Guardo el template a Eliminar
            setTemplateInformationToDelete({
              id: templatesInformation[nexItem].id,
              index: nexItem
            });
            runDeleteTemplatesInformation(nexItem, templatesInformation);
          } else {
            showToast({
              message: `Se han eliminado los registros correctamente`,
              duration: 10000
            });

            // Si hay templates guardados previamente a hacer la eliminación de los duplicados paso a usarlos
            if (haveTemplateWithoutDuplicate && haveTemplateWithoutDuplicate.length) {
              setTemplatesInformation(haveTemplateWithoutDuplicate);
              setTemplatesInformationWithDelete(haveTemplateWithoutDuplicate);
            }
            setIsFinishTheUpload(false);

            // Realizo nuevamente la busqueda de registros para estar seguros de que se han eliminado la totalidad de elementos
            if (templateId) {
              searchTemplateInformationWithId(templateId);
            }
          }
        }
      }
    } else {
      console.debug('Reset delete');

      showToast({
        message: `Se ha detenido el proceso de eliminación`,
        duration: 10000
      });
      handleReset(true);
    }
  }, [finishOnDeleteTemplateInformation, stopDeleteTemplateInformation]);

  /**
   * Mutation watchers
   */
  useEffect(() => {
    if (!mutationDeleteTemplateInformationState.loading) {
      if (mutationDeleteTemplateInformationState.data) {
        console.debug(mutationDeleteTemplateInformationState);
        const { message } = mutationDeleteTemplateInformationState.data.deleteColorsTemplateInformation;

        if (templateInformationToDelete) {
          var index = templatesInformationWithDelete
            .map((x) => {
              return x.id;
            })
            .indexOf(templateInformationToDelete.id);
          const newTemplateInformation = Object.assign([], templatesInformationWithDelete);
          newTemplateInformation.splice(index, 1);
          setTemplatesInformationWithDelete(newTemplateInformation);
          if (!hasBeenStartUpload) {
            setTemplatesInformation(newTemplateInformation);
          }
        }

        if (finishOnDeleteTemplateInformation && finishOnDeleteTemplateInformation.template) {
          const finishUpload = Object.assign({}, finishOnDeleteTemplateInformation);
          finishUpload.finish = true;
          setFinishOnDeleteTemplateInformation(finishUpload);
        } else {
          showToast({
            message,
            duration: 3000
          });
        }
      }
    }
  }, [mutationDeleteTemplateInformationState]);

  useEffect(() => {
    if (!mutationRunJobSearchSpecificationsState.loading) {
      if (mutationRunJobSearchSpecificationsState.data) {
        console.debug(mutationRunJobSearchSpecificationsState);
        const { message } = mutationRunJobSearchSpecificationsState.data.runJobSearchSpecifications;
        // Ejecuto el método que consulta el template cada un minutos hasta que este cambie de estado "running"
        if (templateId) {
          setTimeout(() => {
            searchTemplateById(templateId);
            searchTemplateInformationWithId(templateId);
          }, 4000);
        }
        showToast({
          message,
          duration: 3000
        });
      }
    }
  }, [mutationRunJobSearchSpecificationsState]);

  useEffect(() => {
    if (!mutationUpdateTemplateInformationState.loading) {
      if (mutationUpdateTemplateInformationState.data) {
        console.debug(mutationUpdateTemplateInformationState);
        const {
          message,
          status
        } = mutationUpdateTemplateInformationState.data.updateColorsTemplateInformation;
        if (status == 200) {
          setIsModalAssignOpen(false);
          setLoadingAssignDialog(false);
          setColorTemplateToAssign(null);
          setColorToUseInTheAssignation(null);
          if (templateId) {
            searchTemplateInformationWithId(templateId);
          }
        }
        showToast({
          message,
          duration: 3000
        });
      }
    }
  }, [mutationUpdateTemplateInformationState]);

  /**
   * Query watchers
   */
  useEffect(() => {
    if (errorTemplateInformation) {
      setTemplatesInformation([]);
      setTemplatesInformationWithDelete([]);
      setLoadingQueryInformation(false);
      setErrorOnGetTemplatesInformation(true);
    }
    if (!loadingTemplateInformation) {
      if (
        dataTemplateInformation &&
        dataTemplateInformation.searchTemplatesInformation &&
        dataTemplateInformation.searchTemplatesInformation.data.templates
      ) {
        setErrorOnGetTemplatesInformation(false);
        const response: IColorsTemplateInformation[] =
          dataTemplateInformation.searchTemplatesInformation.data.templates;
        console.debug(response);

        const filteredResponse = response.filter((item) => item.idTemplate == templateId);
        console.debug(filteredResponse);

        setTemplatesInformation(filteredResponse);
        setTemplatesInformationWithDelete(filteredResponse);
        setLoadingQueryInformation(false);
      }
    }
  }, [dataTemplateInformation, loadingTemplateInformation, errorTemplateInformation]);

  /**
   * Mutation Handlers
   */
  const handlerDeleteTemplateInformation = (id: string) => {
    deleteTemplateInformationState({ variables: { id, acronym: TEMPLATE_INFORMATION_ACRONYM } });
  };

  const handlerAssignColorApproval = () => {
    console.debug(colorTemplateToAssign);
    console.debug(colorToUseInTheAssignation);
    if (colorTemplateToAssign && colorToUseInTheAssignation) {
      let newTemplate = Object.assign({}, templatesInformation[colorTemplateToAssign.index]);
      newTemplate.colorName = colorToUseInTheAssignation.colorName;
      newTemplate.value = colorToUseInTheAssignation.value;
      newTemplate.type = colorToUseInTheAssignation.type;
      console.debug(newTemplate);

      updateTemplateInformationState({
        variables: {
          template: newTemplate,
          acronym: TEMPLATE_INFORMATION_ACRONYM
        }
      });
    } else {
      showToast({
        message: 'No se ha pasado la información necesaria para realizar la asignación',
        duration: 3000
      });
    }
  };

  /**
   * Query Handlers
   */

  // Permite realizar la busqueda de un registro de plantilla en base al id y al parametro de busqueda indicado
  const searchTemplateInformation = (param: string) => {
    handleReset();
    makeTemplateSearchTemplateInformation({
      variables: {
        filter: `${config.searchTemplateInformationApi}${KEY_SEARCH}${param}${SORT_COLOR_TEMPLATE_INFORMATION_KEY_SEARCH}`
      }
    });
  };

  const searchTemplateInformationWithId = (idTemplate: string) => {
    handleReset();
    makeTemplateSearchTemplateInformation({
      variables: {
        filter: `${config.searchTemplateInformationApi}${FILTER_BY_TEMPLATE_ID_SEARCH}${idTemplate}${SORT_COLOR_TEMPLATE_INFORMATION_KEY_SEARCH}`
      }
    });
  };

  /**
   * Methods hook
   */

  const handleConfirmationAssign = () => {
    setLoadingAssignDialog(true);
    console.debug(colorToUseInTheAssignation);
    console.debug(colorTemplateToAssign);

    if (colorTemplateToAssign && colorToUseInTheAssignation) {
      handlerAssignColorApproval();
    } else {
      setLoadingAssignDialog(false);
      showToast({
        message: 'No has seleccionado la información necesaria para realizar la asignación',
        duration: 3000
      });
    }
  };

  const handleCancellationAssign = () => {
    setIsModalAssignOpen(false);
  };

  /**
   * Método que permite realizar la ejecución de la busqueda de especificaciones
   */
  const runJobSearchSpec = () => {
    runJobSearchSpecificationsState({
      variables: {
        template: temporalTemplateId,
        acronymInformation: TEMPLATE_INFORMATION_ACRONYM,
        acronym: TEMPLATE_ACRONYM
      }
    });
  };

  /**
   * Método que permite eliminar los registros duplicados
   */
  const removeDuplicatesTemplateInformation = () => {
    const list = Object.assign([], templatesInformation);
    let removeDuplicate: IColorsTemplateInformation[] = [];

    let getDuplicateToDelete = _.filter(list, function (item: IColorsTemplateInformation) {
      if (removeDuplicate.find((find) => find.variations == item.variations)) {
        return true;
      }
      removeDuplicate.push(item);
      return false;
    });

    console.debug(getDuplicateToDelete);

    console.debug(removeDuplicate);
    // Guardo los templates que no se encuentran duplicados
    setHaveTemplateWithoutDuplicate(removeDuplicate);

    // Actualizó la lista de templates a visualizar mostrando solo los duplicados
    setTemplatesInformationWithDelete(getDuplicateToDelete);
    setTemplatesInformation(getDuplicateToDelete);

    // Inicio el proceso de eliminación, luego de eliminar correctamente los registros se deberá de pasar a usar la lista de templates guardados en la variable haveTemplateWithoutDuplicate
    startDeleteAllTemplateInformation(getDuplicateToDelete);
  };

  /**
   * Handler para la ejección de la busqueda de especificaciones
   */
  const runTemplateJob = () => {
    if (temporalTemplateId) {
      runJobSearchSpec();
    }
  };

  /**
   * Handler para la descarga de un archivo xls
   */
  const downloadXlsFileWithTemplateInformation = () => {
    if (templatesInformation.length) {
      // Remove keys from the final array
      let newArray: any = JSON.parse(JSON.stringify(templatesInformation));
      newArray.map((item: any) => {
        delete item.idTemplate;
        delete item.id;
        delete item.creationDate;
        delete item.__typename;
      });
      const ws = XLSX.utils.json_to_sheet(newArray);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, templateById ? templateById.nameTemplate : 'Template' + '.xlsx');
    } else {
      showToast({ message: 'No se poseen registros para generar la plantilla', duration: 3000 });
    }
  };

  /**
   * Handler que permite iniciar la eliminación de los templates
   */
  const startDeleteAllTemplateInformation = (templateToUse: IColorsTemplateInformation[]) => {
    console.debug(templateToUse);

    // Indico que se inicio el proceso de subida de archivos
    setIsFinishTheUpload(true);
    // Reinicio el contador del progress
    setStepProgress(0);
    // Guardo el color que se esta subiendo en este momento
    setCurrentTemplateInformationToDelete(templateToUse[0]);
    // Guardo el template a Eliminar
    setTemplateInformationToDelete({
      id: templateToUse[0].id,
      index: 0
    });
    // Inicio el proceso de subida del color en la posición 0
    runDeleteTemplatesInformation(0, templateToUse);
    setTotalOfItemsPrevToDelete(templateToUse.length);
    // Indico que se estan subiendo los archivos y se muestra el progress component
    setHasBeenStartUpload(true);
  };

  /**
   * Handler que permite hacer el reset de la configuración consultada hasta el momento
   */
  const handleReset = (getResults?: boolean) => {
    setTemplatesInformation([]);
    setTemplatesInformationWithDelete([]);
    setIsFinishTheUpload(false);
    setHasBeenStartUpload(false);
    setCurrentTemplateInformationToDelete(null);
    setFinishOnDeleteTemplateInformation(null);
    setStopDeleteTemplateInformation(false);
    if (getResults && templateId) {
      searchTemplateInformationWithId(templateId);
    }
  };

  /**
   * Handler para el manejo del estado del componente Progress
   */
  const incrementProgress = () => {
    const listElements = templatesInformation.length;
    const itemValueProgress = 100 / listElements;
    let countProgress = stepProgress;
    countProgress = countProgress + itemValueProgress;
    setStepProgress(countProgress);
  };

  /**
   * Handler que permite seleccionar y eliminar un Template Information indicado
   * @param position
   */
  const runDeleteTemplatesInformation = (position: number, templateToUse: IColorsTemplateInformation[]) => {
    const templateToDelete = templateToUse[position];
    console.debug(templateToUse);
    console.debug(templateToDelete);

    setFinishOnDeleteTemplateInformation({
      finish: false,
      template: templateToDelete,
      position: position
    });
    setCurrentTemplateInformationToDelete(templateToDelete);

    handlerDeleteTemplateInformation(templateToDelete.id);
  };

  const ContextProps: UseColorsTemplateInformationManager = useMemo(() => {
    return {
      templatesInformation,
      templatesInformationWithDelete,
      searchValueInformation,
      loadingQueryInformation,
      errorOnGetTemplatesInformation,
      templateInformationToDelete,
      stepProgress,
      finishOnDeleteTemplateInformation,
      currentTemplateInformationToDelete,
      isFinishTheUpload,
      hasBeenStartUpload,
      totalOfItemsPrevToDelete,
      stopDeleteTemplateInformation,
      getTemplateItemsDuplicate,
      haveTemplateWithoutDuplicate,
      isModalAssignOpen,
      loadingAssignDialog,
      colorTemplateToAssign,
      colorToUseInTheAssignation,
      getTemplateItemsWithoutValue,
      setIsModalAssignOpen,
      setColorTemplateToAssign,
      setColorToUseInTheAssignation,
      handleCancellationAssign,
      handleConfirmationAssign,
      showToast,
      setTemplateInformationToDelete,
      setStopDeleteTemplateInformation,
      setSearchValueInformation,
      handlerDeleteTemplateInformation,
      searchTemplateInformation,
      searchTemplateInformationWithId,
      runJobSearchSpec,
      removeDuplicatesTemplateInformation,
      runTemplateJob,
      downloadXlsFileWithTemplateInformation,
      startDeleteAllTemplateInformation,
      handleReset,
      incrementProgress,
      runDeleteTemplatesInformation
    };
  }, [
    templatesInformation,
    templatesInformationWithDelete,
    searchValueInformation,
    loadingQueryInformation,
    errorOnGetTemplatesInformation,
    templateInformationToDelete,
    stepProgress,
    finishOnDeleteTemplateInformation,
    currentTemplateInformationToDelete,
    isFinishTheUpload,
    hasBeenStartUpload,
    totalOfItemsPrevToDelete,
    stopDeleteTemplateInformation,
    getTemplateItemsDuplicate,
    haveTemplateWithoutDuplicate,
    isModalAssignOpen,
    loadingAssignDialog,
    colorTemplateToAssign,
    colorToUseInTheAssignation,
    getTemplateItemsWithoutValue
  ]);
  return ContextProps;
};
