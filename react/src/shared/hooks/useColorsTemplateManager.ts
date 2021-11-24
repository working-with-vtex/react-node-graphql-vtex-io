import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useRuntime } from 'vtex.render-runtime';
import {
  COLOR_TEMPLATE_FIELDS,
  config,
  IColorsTemplate,
  IColorsTemplateManager,
  KEY_SEARCH,
  SORT_COLOR_TEMPLATE_KEY_SEARCH,
  TEMPLATE_ACRONYM,
  UseColorsTemplateManager,
  IColorsTemplateCreation
} from '..';
import DeleteTemplate from '../../graphql/mutations/DeleteTemplate.graphql';
import CreateTemplate from '../../graphql/mutations/CreateTemplate.graphql';
import UpdateTemplateById from '../../graphql/mutations/UpdateTemplateById.graphql';
import SearchColorsTemplate from '../../graphql/queries/SearchColorsTemplate.graphql';
import SearchColorsTemplateById from '../../graphql/queries/SearchColorsTemplateById.graphql';
import { path } from 'ramda';

export const useColorsTemplateManager = (props: IColorsTemplateManager) => {
  const { showToast, sessionQuery } = props;

  // Query
  const [
    makeTemplateSearch,
    { loading: loadingTemplate, data: dataTemplate, error: errorTemplate }
  ] = useLazyQuery(SearchColorsTemplate, { partialRefetch: true, fetchPolicy: 'no-cache' });
  const [
    makeTemplateSearchById,
    { loading: loadingTemplateId, data: dataTemplateId, error: errorTemplateId }
  ] = useLazyQuery(SearchColorsTemplateById, { partialRefetch: true, fetchPolicy: 'no-cache' });

  // Mutation
  const [changeTemplateByIdState, mutationChangeTemplateByIdState] = useMutation(UpdateTemplateById);
  const [deleteTemplateState, mutationDeleteTemplateState] = useMutation(DeleteTemplate);
  const [createTemplateState, mutationCreateTemplateState] = useMutation(CreateTemplate);

  // State Hook
  const runtime = useRuntime();
  const [userEmail, setUserEmail] = useState('');

  const [templates, setTemplates] = useState<IColorsTemplate[]>([]);
  const [templateById, setTemplateById] = useState<IColorsTemplate | null>(null);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [temporalTemplateId, setTemporalTemplateId] = useState(templateById);
  const [searchValue, setSearchValue] = useState('');
  const [loadingQuery, setLoadingQuery] = useState(true);
  const [errorOnGetTemplates, setErrorOnGetTemplates] = useState(false);

  useEffect(() => {
    setUserEmail(path(['getSession', 'adminUserEmail'], sessionQuery));
  }, [sessionQuery]);

  /**
   * Mutation watchers
   */
  useEffect(() => {
    if (!mutationDeleteTemplateState.loading) {
      if (mutationDeleteTemplateState.data) {
        const { message } = mutationDeleteTemplateState.data.deleteColorsTemplate;

        showToast({
          message,
          duration: 3000
        });

        setTimeout(() => {
          runtime.navigate({
            page: config.colorConfiguration,
            params: { id: 'generateTemplate' }
          });
        }, 1000);
      }
    }
  }, [mutationDeleteTemplateState]);

  useEffect(() => {
    if (!mutationCreateTemplateState.loading) {
      if (mutationCreateTemplateState.data) {
        const { message } = mutationCreateTemplateState.data.createColorsTemplate;

        showToast({
          message,
          duration: 3000
        });

        setTimeout(() => {
          runtime.navigate({
            page: config.colorConfiguration,
            params: { id: 'generateTemplate' }
          });
        }, 1000);
      }
    }
  }, [mutationCreateTemplateState]);

  useEffect(() => {
    if (!mutationChangeTemplateByIdState.loading) {
      if (mutationChangeTemplateByIdState.data) {
        console.debug(mutationChangeTemplateByIdState);
        const { message } = mutationChangeTemplateByIdState.data.updateColorsTemplateById;

        setTemplateById(temporalTemplateId);

        showToast({
          message,
          duration: 3000
        });
      }
    }
  }, [mutationChangeTemplateByIdState]);

  /**
   * Query watchers
   */
  useEffect(() => {
    if (errorTemplate) {
      setTemplates([]);
      setLoadingQuery(false);
      setErrorOnGetTemplates(true);
    }
    if (!loadingTemplate) {
      if (dataTemplate && dataTemplate.searchTemplates && dataTemplate.searchTemplates.data.templates) {
        setErrorOnGetTemplates(false);
        setLoadingQuery(false);
        const colorsList = dataTemplate.searchTemplates.data.templates;
        console.debug(colorsList);

        setTemplates(colorsList);
      } else {
        setLoadingQuery(false);
      }
    }
  }, [dataTemplate, loadingTemplate, errorTemplate]);

  useEffect(() => {
    if (errorTemplateId) {
      setTemplateById(null);
      setLoadingQuery(false);
      setErrorOnGetTemplates(true);
    } else if (!loadingTemplateId) {
      if (
        dataTemplateId &&
        dataTemplateId.searchTemplateById &&
        dataTemplateId.searchTemplateById.data.template
      ) {
        setErrorOnGetTemplates(false);
        setLoadingQuery(false);
        const colorDetail = dataTemplateId.searchTemplateById.data.template;
        setTemplateById(colorDetail);
      } else {
        setLoadingQuery(false);
      }
    }
  }, [dataTemplateId, errorTemplateId, loadingTemplateId]);

  /**
   * Mutation handlers
   */
  const saveChangesTemplateById = (template: IColorsTemplate) => {
    changeTemplateByIdState({ variables: { template, acronym: TEMPLATE_ACRONYM } });
  };

  const handlerDeleteTemplate = (id: string) => {
    deleteTemplateState({ variables: { id, acronym: TEMPLATE_ACRONYM } });
  };

  const handlerCreateTemplate = (template: IColorsTemplateCreation) => {
    createTemplateState({ variables: { template, acronym: TEMPLATE_ACRONYM } });
  };

  /**
   * Query handlers
   */
  const searchTemplate = (param?: string) => {
    if (param) {
      makeTemplateSearch({
        variables: {
          filter: `${config.searchTemplateApi}${KEY_SEARCH}${param}${SORT_COLOR_TEMPLATE_KEY_SEARCH}`
        }
      });
    } else {
      makeTemplateSearch({
        variables: {
          filter: `${config.searchTemplateApi}${SORT_COLOR_TEMPLATE_KEY_SEARCH}`
        }
      });
    }
  };

  /**
   * Methods hook
   */

  /**
   * Método que permite reiniciar una plantilla
   */
  const restartTemplate = () => {
    if (temporalTemplateId) {
      const clearTemplate: IColorsTemplate = {
        ...temporalTemplateId,
        from: 1,
        productsId: '',
        productsWithErrors: 0,
        productsCreatedAutomatic: 0,
        productsCreatedAutomaticId: '',
        status: 'stopped'
      };
      setTemporalTemplateId(clearTemplate);
      saveChangesTemplateById(clearTemplate);
    }
  };

  /**
   * Método que permite obtener un template por medio de la busqueda empleando los fields de masterData
   */
  const searchTemplateById = (id: string) => {
    makeTemplateSearchById({
      variables: {
        id: `${config.getColorTemplateById}${id}${COLOR_TEMPLATE_FIELDS}`
      }
    });
  };

  const ContextProps: UseColorsTemplateManager = useMemo(() => {
    return {
      runtime,
      templates,
      templateById,
      templateId,
      temporalTemplateId,
      searchValue,
      loadingQuery,
      errorOnGetTemplates,
      userEmail,
      handlerCreateTemplate,
      setTemporalTemplateId,
      showToast,
      setTemplateId,
      setSearchValue,
      searchTemplateById,
      restartTemplate,
      searchTemplate,
      saveChangesTemplateById,
      handlerDeleteTemplate
    };
  }, [
    runtime,
    templates,
    templateById,
    templateId,
    temporalTemplateId,
    searchValue,
    loadingQuery,
    errorOnGetTemplates,
    userEmail
  ]);
  return ContextProps;
};
