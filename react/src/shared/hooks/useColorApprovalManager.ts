import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useRuntime } from 'vtex.render-runtime';
import {
  COLORS_ACRONYM,
  COLORS_APPROVAL_ACRONYM,
  config,
  FILTER_BY_STATE_SEARCH,
  IColors,
  IColorsApproval,
  IDeleteColorApproval,
  UseColorApprovalManager,
  KEY_SEARCH,
  ShowToastParams,
  SORT_COLOR_APPROVAL_KEY_SEARCH,
  StateFilter
} from '..';
import AssignApprovalColor from '../../graphql/mutations/AssignApprovalColor.graphql';
import DeleteApprovalColor from '../../graphql/mutations/DeleteApprovalColor.graphql';
import UpdateApprovalColorById from '../../graphql/mutations/UpdateApprovalColorById.graphql';
import SearchApprovalColor from '../../graphql/queries/SearchApprovalColor.graphql';

export const useColorApprovalManager = ({ showToast }: { showToast: (params: ShowToastParams) => void }) => {
  const [colorsApprovalList, setColorsApprovalList] = useState<IColorsApproval[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const [loadingQuery, setLoadingQuery] = useState(true);
  const [errorOnGetColorApproval, setErrorOnGetColorApproval] = useState(false);

  // Modal Dialog Assign
  const [isModalAssignOpen, setIsModalAssignOpen] = useState(false);
  const [loadingAssignDialog, setLoadingAssignDialog] = useState(false);
  const [colorApprovalToAssign, setColorApprovalToAssign] = useState<IDeleteColorApproval | null>(null);
  const [colorToUseInTheAssignation, setColorToUseInTheAssignation] = useState<IColors | null>(null);

  // Action to UpdateApprovalColorById
  const [changeColorApprovalByIdState, mutationColorApprovalByIdState] = useMutation(UpdateApprovalColorById);
  // Action to DeleteApprovalColor
  const [deleteApprovalColorState, mutationDeleteApprovalColorState] = useMutation(DeleteApprovalColor);
  // Action to AssignApprovalColor
  const [assignApprovalColorState, mutationAssignApprovalColorState] = useMutation(AssignApprovalColor);

  const runtime = useRuntime();

  // Queries
  const [
    makeColorApprovalSearch,
    { loading: loadingColorApproval, data: dataColorApproval, error: errorColorApproval }
  ] = useLazyQuery(SearchApprovalColor, { partialRefetch: true, fetchPolicy: 'no-cache' });

  // Basic handlers, Alerts And dialog
  const handleConfirmationDelete = (color: IDeleteColorApproval) => {
    if (color) {
      handlerDeleteColorApproval(color);
    } else {
      showToast({
        message: 'Se ha presentado un problema al eliminar el color',
        duration: 3000
      });
    }
  };

  const handleConfirmationAssign = () => {
    setLoadingAssignDialog(true);
    console.debug(colorToUseInTheAssignation);
    console.debug(colorApprovalToAssign);

    if (colorApprovalToAssign && colorToUseInTheAssignation) {
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

  // Mutations watchers

  useEffect(() => {
    if (!mutationColorApprovalByIdState.loading) {
      if (mutationColorApprovalByIdState.data) {
        console.debug(mutationColorApprovalByIdState);

        const { message } = mutationColorApprovalByIdState.data.UpdateApprovalColorById;

        showToast({
          message,
          duration: 3000
        });
      }
    }
  }, [mutationColorApprovalByIdState]);

  useEffect(() => {
    if (!mutationDeleteApprovalColorState.loading) {
      if (mutationDeleteApprovalColorState.data) {
        console.debug(mutationDeleteApprovalColorState);

        const { message } = mutationDeleteApprovalColorState.data.deleteApprovalColor;

        if (searchValue) {
          searchColorsApproval(searchValue);
        } else {
          searchColorsApproval();
        }

        showToast({
          message,
          duration: 3000
        });
      }
    }
  }, [mutationDeleteApprovalColorState]);

  useEffect(() => {
    if (!mutationAssignApprovalColorState.loading) {
      if (mutationAssignApprovalColorState.data) {
        console.debug(mutationAssignApprovalColorState);
        const { message, status } = mutationAssignApprovalColorState.data.approveColor;
        if (status == 200) {
          setIsModalAssignOpen(false);
          setLoadingAssignDialog(false);
          setColorApprovalToAssign(null);
          setColorToUseInTheAssignation(null);
          searchColorsApproval();
        }
        showToast({
          message,
          duration: 3000
        });
      }
    }
  }, [mutationAssignApprovalColorState]);

  // Mutation Handlers

  const saveChangesColorApprovalById = (color: IColorsApproval) => {
    changeColorApprovalByIdState({ variables: { color, colorsAcronym: COLORS_APPROVAL_ACRONYM } });
  };

  const handlerDeleteColorApproval = (color: IDeleteColorApproval) => {
    deleteApprovalColorState({ variables: { id: color.id, colorsAcronym: COLORS_APPROVAL_ACRONYM } });
  };

  const handlerAssignColorApproval = () => {
    console.debug(colorApprovalToAssign);
    console.debug(colorToUseInTheAssignation);
    if (colorApprovalToAssign && colorToUseInTheAssignation) {
      const colorToUseInTheAssignationCopy = JSON.parse(JSON.stringify(colorToUseInTheAssignation));
      if (colorToUseInTheAssignationCopy && colorToUseInTheAssignationCopy.idMasterData) {
        colorToUseInTheAssignationCopy.id = colorToUseInTheAssignation.idMasterData;
        delete colorToUseInTheAssignationCopy['idMasterData'];
      }
      console.log(colorToUseInTheAssignationCopy);

      assignApprovalColorState({
        variables: {
          colorToApproval: colorsApprovalList[colorApprovalToAssign.index],
          colorToAssign: colorToUseInTheAssignationCopy,
          colorsApprovalAcronym: COLORS_APPROVAL_ACRONYM,
          colorsAcronym: COLORS_ACRONYM
        }
      });
    }
  };

  // Query Handlers

  const searchColorWithState = (state: StateFilter) => {
    makeColorApprovalSearch({
      variables: {
        filter: `${config.searchColorApprovalApi}${FILTER_BY_STATE_SEARCH}${state}${SORT_COLOR_APPROVAL_KEY_SEARCH}`
      }
    });
  };

  const searchColorsApproval = (param?: string) => {
    setColorsApprovalList([]);
    if (param) {
      makeColorApprovalSearch({
        variables: {
          filter: `${config.searchColorApprovalApi}${KEY_SEARCH}${param}${SORT_COLOR_APPROVAL_KEY_SEARCH}`
        }
      });
    } else {
      makeColorApprovalSearch({
        variables: {
          filter: `${config.searchColorApprovalApi}${SORT_COLOR_APPROVAL_KEY_SEARCH}`
        }
      });
    }
  };

  // Query Data watcher

  useEffect(() => {
    if (errorColorApproval) {
      setColorsApprovalList([]);
      setLoadingQuery(false);
      setErrorOnGetColorApproval(true);
    }
    if (!loadingColorApproval) {
      if (
        dataColorApproval &&
        dataColorApproval.searchApprovalColors &&
        dataColorApproval.searchApprovalColors.data.colors
      ) {
        setErrorOnGetColorApproval(false);
        setLoadingQuery(false);
        const response = dataColorApproval.searchApprovalColors.data.colors;
        setColorsApprovalList(response);
      } else {
        setLoadingQuery(false);
      }
    }
  }, [dataColorApproval, loadingColorApproval, errorColorApproval]);

  const ContextProps: UseColorApprovalManager = useMemo(() => {
    return {
      colorsApprovalList,
      loadingQuery,
      errorOnGetColorApproval,
      runtime,
      searchValue,
      loadingAssignDialog,
      isModalAssignOpen,
      colorApprovalToAssign,
      colorToUseInTheAssignation,
      searchColorWithState,
      setColorToUseInTheAssignation,
      handleConfirmationAssign,
      handleCancellationAssign,
      searchColorsApproval,
      saveChangesColorApprovalById,
      setSearchValue,
      handleConfirmationDelete,
      setColorApprovalToAssign,
      setIsModalAssignOpen,
      showToast
    };
  }, [
    colorsApprovalList,
    colorApprovalToAssign,
    loadingQuery,
    errorOnGetColorApproval,
    runtime,
    searchValue,
    isModalAssignOpen,
    colorToUseInTheAssignation,
    loadingAssignDialog
  ]);

  return ContextProps;
};
