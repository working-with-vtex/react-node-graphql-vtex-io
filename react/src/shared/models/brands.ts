import { IDialogState } from '.';

export interface imageUrlType {}

export interface BrandsType {
  id: number;
  slug: string;
  name: string;
  titleTag: string;
  active: boolean;
  metaTagDescription: string;
  imageUrl: imageUrlType;
  isDuplicate?: boolean;
}

export interface BrandsItemType {
  name: string;
  keywords: string;
  text: string;
  siteTitle: string;
  menuHome: boolean;
  active: boolean;
  isDuplicate?: boolean;
  isCreated?: boolean;
  id: string;
}

export interface IDialogStateBrands extends IDialogState {
  brand?: BrandsItemType;
}
