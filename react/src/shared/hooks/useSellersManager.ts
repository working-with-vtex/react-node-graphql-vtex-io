import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useRuntime } from 'vtex.render-runtime';
import {
  config,
  IDeleteSeller,
  ISellerCreation,
  ISellersColor,
  KEY_SEARCH,
  SELLERS_ACRONYM,
  SELLERS_FIELDS,
  ShowToastParams,
  SORT_SELLER_KEY_SEARCH,
  UseSellersManager
} from '..';
import CreateSeller from '../../graphql/mutations/CreateSeller.graphql';
import DeleteSeller from '../../graphql/mutations/DeleteSeller.graphql';
import UpdateSellerById from '../../graphql/mutations/UpdateSellerById.graphql';
import SearchSellerById from '../../graphql/queries/SearchSellerById.graphql';
import SearchSellers from '../../graphql/queries/SearchSellers.graphql';

export const useSellersManager = ({ showToast }: { showToast: (params: ShowToastParams) => void }) => {
  const [sellersList, setSellersList] = useState<ISellersColor[]>([]);
  const [sellerById, setSellerById] = useState<ISellersColor | null>(null);
  const [searchValue, setSearchValue] = useState('');

  const [loadingQuery, setLoadingQuery] = useState(true);
  const [errorOnGetSellers, setErrorOnGetSellers] = useState(false);

  // Action to UpdateColorById
  const [changeSellerByIdState, mutationSellerByIdState] = useMutation(UpdateSellerById);
  // Action to CreateColor
  const [createSellerState, mutationCreateSellerState] = useMutation(CreateSeller);
  // Action to DeleteColor
  const [deleteSellerState, mutationDeleteSellerState] = useMutation(DeleteSeller);
  const runtime = useRuntime();

  // Queries
  const [
    makeSellerSearch,
    { loading: loadingSellers, data: dataSellers, error: errorSellers }
  ] = useLazyQuery(SearchSellers, { partialRefetch: true, fetchPolicy: 'no-cache' });
  const [
    makeSellerSearchById,
    { loading: loadingSellerId, data: dataSellerId, error: errorSellerId }
  ] = useLazyQuery(SearchSellerById, { partialRefetch: true, fetchPolicy: 'no-cache' });

  // Mutations watchers

  useEffect(() => {
    if (!mutationSellerByIdState.loading) {
      if (mutationSellerByIdState.data) {
        console.debug(mutationSellerByIdState);

        const { message } = mutationSellerByIdState.data.updateSellerById;
        showToast({
          message,
          duration: 3000
        });
      }
    }
  }, [mutationSellerByIdState]);

  useEffect(() => {
    if (!mutationDeleteSellerState.loading) {
      if (mutationDeleteSellerState.data) {
        console.debug(mutationDeleteSellerState);

        const { message } = mutationDeleteSellerState.data.deleteSeller;

        if (searchValue) {
          searchSellers(searchValue);
        } else {
          searchSellers();
        }

        showToast({
          message,
          duration: 3000
        });
      }
    }
  }, [mutationDeleteSellerState]);

  useEffect(() => {
    if (!mutationCreateSellerState.loading) {
      if (mutationCreateSellerState.data) {
        console.debug(mutationCreateSellerState);

        const { status, message } = mutationCreateSellerState.data.createSeller;
        console.debug(status, message);

        showToast({
          message,
          duration: 3000
        });
      }
    }
  }, [mutationCreateSellerState]);

  // Query Data watcher

  useEffect(() => {
    if (errorSellers) {
      setSellersList([]);
      setLoadingQuery(false);
      setErrorOnGetSellers(true);
    }
    if (!loadingSellers) {
      if (dataSellers && dataSellers.searchSellers && dataSellers.searchSellers.data.sellers) {
        setErrorOnGetSellers(false);
        setLoadingQuery(false);
        const response = dataSellers.searchSellers.data.sellers;
        setSellersList(response);
      } else {
        setLoadingQuery(false);
      }
    }
  }, [dataSellers, loadingSellers, errorSellers]);

  useEffect(() => {
    if (errorSellerId) {
      setSellerById(null);
      setLoadingQuery(false);
      setErrorOnGetSellers(true);
    } else if (!loadingSellerId) {
      if (dataSellerId && dataSellerId.searchSellerById && dataSellerId.searchSellerById.data.seller) {
        setErrorOnGetSellers(false);
        setLoadingQuery(false);
        const colorDetail = dataSellerId.searchSellerById.data.seller;
        setSellerById(colorDetail);
      } else {
        setLoadingQuery(false);
      }
    }
  }, [dataSellerId, errorSellerId, loadingSellerId]);

  // Mutation Handlers

  const saveChangesSellerById = (seller: ISellersColor) => {
    changeSellerByIdState({ variables: { seller, colorSellerAcronym: SELLERS_ACRONYM } });
  };

  const handlerCreateSeller = (seller: ISellerCreation) => {
    createSellerState({ variables: { seller, colorSellerAcronym: SELLERS_ACRONYM } });
  };

  const handlerDeleteSeller = (seller: IDeleteSeller) => {
    deleteSellerState({ variables: { id: seller.id, colorSellerAcronym: SELLERS_ACRONYM } });
  };

  // Query Handlers

  const searchSellers = (param?: string) => {
    if (param) {
      makeSellerSearch({
        variables: {
          filter: `${config.searchSellerApi}${KEY_SEARCH}${param}${SORT_SELLER_KEY_SEARCH}`
        }
      });
    } else {
      makeSellerSearch({
        variables: {
          filter: `${config.searchSellerApi}${SORT_SELLER_KEY_SEARCH}`
        }
      });
    }
  };

  const searchSellerById = (id: string) => {
    makeSellerSearchById({
      variables: {
        id: `${config.getSellerById}${id}${SELLERS_FIELDS}`
      }
    });
  };

  const handleConfirmationDelete = (seller: IDeleteSeller) => {
    if (seller) {
      handlerDeleteSeller(seller);
    } else {
      showToast({
        message: 'Se ha presentado un problema al eliminar el seller',
        duration: 3000
      });
    }
  };

  const ContextProps: UseSellersManager = useMemo(() => {
    return {
      sellersList,
      sellerById,
      loadingQuery,
      errorOnGetSellers,
      runtime,
      searchValue,
      searchSellers,
      searchSellerById,
      setSearchValue,
      handleConfirmationDelete,
      setSellerById,
      saveChangesSellerById,
      handlerCreateSeller,
      showToast
    };
  }, [sellersList, sellerById, loadingQuery, errorOnGetSellers, runtime, searchValue]);

  return ContextProps;
};
