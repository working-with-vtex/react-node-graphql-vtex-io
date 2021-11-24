import { ShowToastParams } from './general';

export interface ISellersColor {
  id: string;
  sellerId: string;
  sellerName: string;
  specificationName: string;
}

export interface ISelectType extends ISellersColor {
  value: string;
  label: string;
}

export interface UseSellersManager {
  sellersList: ISellersColor[];
  sellerById: ISellersColor | null;
  loadingQuery: boolean;
  errorOnGetSellers: boolean;
  runtime: any;
  searchValue: string;
  showToast: (params: ShowToastParams) => void;
  searchSellers: (param?: string | undefined) => void;
  searchSellerById: (id: string) => void;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  handleConfirmationDelete: (seller: IDeleteSeller) => void;
  setSellerById: React.Dispatch<React.SetStateAction<ISellersColor | null>>;
  saveChangesSellerById: (seller: ISellersColor) => void;
  handlerCreateSeller: (seller: ISellerCreation) => void;
}

export interface IDeleteSeller {
  id: string;
  index: number;
}

export interface ISellerCreation {
  sellerId: string;
  sellerName: string;
  specificationName: string;
}
