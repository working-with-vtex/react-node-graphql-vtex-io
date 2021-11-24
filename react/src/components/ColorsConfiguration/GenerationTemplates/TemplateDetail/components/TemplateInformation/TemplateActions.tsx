import React from 'react';
import { ActionMenu } from 'vtex.styleguide';
import {
  TemplateStatus,
  UseColorsTemplateInformationManager,
  UseColorsTemplateManager
} from '../../../../../../shared';

interface PropsActions {
  handlerUpdateStatusTemplate: (status: TemplateStatus) => void;
  colorsTemplateInformationManager: UseColorsTemplateInformationManager;
  colorsTemplateManager: UseColorsTemplateManager;
}

const TemplateActions = (props: PropsActions) => {
  const {
    handlerUpdateStatusTemplate,
    colorsTemplateInformationManager: {
      getTemplateItemsDuplicate,
      templatesInformation,
      searchValueInformation,
      loadingQueryInformation,
      hasBeenStartUpload,
      startDeleteAllTemplateInformation,
      searchTemplateInformation,
      downloadXlsFileWithTemplateInformation,
      setStopDeleteTemplateInformation,
      searchTemplateInformationWithId
    },
    colorsTemplateManager: {
      temporalTemplateId,
      templateId,
      restartTemplate,
      searchTemplateById,
      showToast,
      handlerDeleteTemplate
    }
  } = props;

  const handlerSearchTemplates = (param?: string) => {
    if (param) {
      searchTemplateInformation(param);
    } else {
      if (templateId) {
        searchTemplateInformationWithId(templateId);
      }
    }
  };

  const options = [
    {
      label: ' Eliminar plantilla',
      onClick: () =>
        showToast({
          message: 'Esta seguro de eliminar la plantilla',
          action: {
            label: 'Eliminar',
            onClick: () => {
              if (templateId) {
                handlerDeleteTemplate(templateId);
              }
            }
          }
        }),
      disabled:
        temporalTemplateId &&
        (temporalTemplateId.status == 'finished' || temporalTemplateId.status == 'stopped') &&
        templatesInformation.length <= 0
          ? false
          : true
    },
    {
      disabled:
        temporalTemplateId && (temporalTemplateId.status == 'stopped' || temporalTemplateId.status == null)
          ? false
          : true,
      label: 'Ejecutar',
      onClick: () => handlerUpdateStatusTemplate('running')
    },
    {
      onClick: () => handlerUpdateStatusTemplate('stopped'),
      label: 'Detener Ejecución',
      disabled: temporalTemplateId && temporalTemplateId.status == 'running' ? false : true
    },
    {
      label: 'Reiniciar plantilla',
      onClick: () => restartTemplate(),
      disabled: temporalTemplateId && temporalTemplateId.status == 'stopped' ? true : false
    },
    {
      label: 'Descargar',
      disabled: templatesInformation.length && getTemplateItemsDuplicate <= 0 ? false : true,
      onClick: () => downloadXlsFileWithTemplateInformation()
    },
    {
      label: 'Recargar registros y configuración',
      onClick: () => {
        if (searchValueInformation) {
          handlerSearchTemplates(searchValueInformation);
        } else {
          handlerSearchTemplates();
        }

        if (templateId) {
          searchTemplateById(templateId);
        }
      }
    },
    {
      label: 'Eliminar registros generados',
      disabled:
        !templatesInformation.length || (!loadingQueryInformation && hasBeenStartUpload) ? true : false,
      onClick: () =>
        showToast({
          message: '¿Desea eliminar todos los registros encontrados?',
          action: {
            label: 'Eliminar',
            onClick: () => startDeleteAllTemplateInformation(templatesInformation)
          }
        })
    },
    {
      label: 'Detener eliminación de los registros',
      disabled: !hasBeenStartUpload,
      onClick: () => setStopDeleteTemplateInformation(true)
    }
  ];

  return (
    <ActionMenu
      label="Acciones"
      buttonProps={{
        variation: 'primary'
      }}
      options={options}
    />
  );
};

export default TemplateActions;
