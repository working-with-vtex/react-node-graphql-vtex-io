import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, EmptyState, PageBlock, PageHeader, Spinner } from 'vtex.styleguide';
import {
  config,
  TemplateStatus,
  UseColorsTemplateInformationManager,
  UseColorsTemplateManager,
  UseSellersManager
} from '../../../../../../shared';
import { ColorConfigurationContext, SellersContext, ColorsContext } from '../../../../../../Context';
import ProgressComponent from '../Progress';
import TemplateRegistersList from '../TemplateRegistersList';
import Information from './Information';
import TemplateActions from './TemplateActions';
import WrapperTemplateConfiguration from './WrapperTemplateConfiguration';
import ModalAssignColorToTemplateInfo from '../ModalAssignColorToTemplateInfo';
const { useColorsConfiguration } = ColorConfigurationContext;
const { useSellers } = SellersContext;
const { useColors } = ColorsContext;

interface Props {
  colorsTemplateInformationManager: UseColorsTemplateInformationManager;
  colorsTemplateManager: UseColorsTemplateManager;
  sellersManager: UseSellersManager;
}

const TemplateInformation = (props: Props) => {
  const [haveChanges, setHaveChanges] = useState(false);
  const {
    colorsTemplateInformationManager,
    colorsTemplateManager,
    sellersManager,
    colorsTemplateInformationManager: { hasBeenStartUpload, loadingQueryInformation, runTemplateJob },
    colorsTemplateManager: {
      errorOnGetTemplates,
      runtime,
      loadingQuery,
      temporalTemplateId,
      setTemporalTemplateId,
      templateById,
      templateId,
      searchTemplateById,
      saveChangesTemplateById,
      setTemplateId
    }
  } = props;
  const { route } = runtime;

  useEffect(() => {
    if (templateId) {
      searchTemplateById(templateId);
      // Pongo a escuchar si el estado es running para que se consulte cada minuto la información de la plantilla
    }
  }, [templateId]);

  useEffect(() => {
    if (route.params && route.params.id) {
      setTemplateId(route.params.id);
    }
  }, [route]);

  useEffect(() => {
    if (templateById) {
      setTemporalTemplateId(templateById);
      setHaveChanges(false);
    }
  }, [templateById]);

  useEffect(() => {
    if (
      temporalTemplateId &&
      temporalTemplateId.sellerName !== '' &&
      temporalTemplateId.sellerFieldName !== '' &&
      temporalTemplateId.nameTemplate !== ''
    ) {
      setHaveChanges(!_.isEqual(templateById, temporalTemplateId));
    } else {
      setHaveChanges(false);
    }
  }, [temporalTemplateId]);

  const handlerSaveChanges = () => {
    if (temporalTemplateId) {
      saveChangesTemplateById(temporalTemplateId);
    }
  };

  const handlerUpdateStatusTemplate = (status: TemplateStatus) => {
    if (temporalTemplateId) {
      const temporal = { ...temporalTemplateId, status: status, from: 1 };
      setTemporalTemplateId(temporal);
      saveChangesTemplateById(temporal);
      if (status == 'running') {
        runTemplateJob();
      }
    }
  };

  if (errorOnGetTemplates) {
    return (
      <PageBlock>
        <EmptyState title="Plantilla no encontrada">
          <p>Valida que el id sea correcto</p>

          <div className="pt5">
            <Button
              variation="secondary"
              size="small"
              onClick={() => {
                runtime.navigate({
                  page: config.colorConfiguration,
                  params: { id: 'generateTemplate' }
                });
              }}
            >
              <span className="flex align-baseline">Volver</span>
            </Button>
          </div>
        </EmptyState>
      </PageBlock>
    );
  }

  if (loadingQuery || !temporalTemplateId) {
    return (
      <div className="mt5">
        <PageBlock>
          <PageBlock variation="annotated" title="Buscando plantilla" subtitle="espere un momento...">
            <div className="flex items-center justify-center">
              <Spinner />
            </div>
          </PageBlock>
        </PageBlock>
      </div>
    );
  }

  return (
    <div className="pa5">
      <Information />

      <PageHeader
        title="Edita la información de la plantilla"
        linkLabel="Volver"
        onLinkClick={(_e: any) => {
          runtime.navigate({
            page: config.colorConfiguration,
            params: { id: 'generateTemplate' }
          });
        }}
      >
        {!loadingQueryInformation ? (
          <span className="mr4 flex">
            <TemplateActions
              {...{ handlerUpdateStatusTemplate, colorsTemplateInformationManager, colorsTemplateManager }}
            />
          </span>
        ) : null}
      </PageHeader>

      <PageBlock variation="full">
        <div>
          {/* Lista de registros del reporte */}
          {templateId ? (
            <>
              {hasBeenStartUpload ? <ProgressComponent /> : null}
              <TemplateRegistersList {...{ colorsTemplateInformationManager, colorsTemplateManager }} />
            </>
          ) : null}
        </div>

        <WrapperTemplateConfiguration
          {...{
            handlerSaveChanges,
            haveChanges,
            sellersManager,
            colorsTemplateInformationManager,
            colorsTemplateManager
          }}
        />
      </PageBlock>
    </div>
  );
};

const WrapperTemplate = () => {
  const state = useColorsConfiguration();
  const stateSellers = useSellers();
  const stateColors = useColors();

  if (!state || !stateSellers || !stateColors) return null;

  return (
    <>
      <ModalAssignColorToTemplateInfo {...{ ...state, ...stateColors }} />
      <TemplateInformation {...{ ...state, ...stateSellers }} />
    </>
  );
};

export default WrapperTemplate;
