import { IColors } from './colors';
import { ShowToastParams } from './general';

export type TemplateStatus = 'stopped' | 'running' | 'finished';

export type StatusParam = 'accepted' | 'pending' | 'denied';

export interface IColorTemplateBase {
  creationDate: string;
  nameTemplate: string;
  productsId: string;
  productsWithErrors: number;
  sellerFieldName: string;
  sellerName: string;
  statusParam: StatusParam;
  productsCreatedAutomatic: number;
  productsCreatedAutomaticId: string;
  to: number;
  from: number;
  total: number;
  user: string;
  status: TemplateStatus;
}
export interface IColorsTemplate extends IColorTemplateBase {
  id: string;
}

export interface IColorsTemplateCreation extends IColorTemplateBase {}

export interface IDeleteTemplateInformation {
  id: string;
  index: number;
}

export interface IAssignColorTemplate {
  id: string;
  index: number;
}

export interface FinishDeleteTemplate {
  finish: boolean;
  template: IColorsTemplateInformation;
  position: number;
}

export interface IColorsTemplateInformation {
  colorName: string;
  creationDate: string;
  idTemplate: string;
  isLight: boolean;
  sellers: string;
  type: string;
  value: string;
  variations: string;
  id: string;
}

export interface IColorsTemplateManager {
  showToast: (params: ShowToastParams) => void;
  sessionQuery: any;
}

export interface IColorsTemplateInformationManager {
  colorsTemplateManager: UseColorsTemplateManager;
}

export interface UseColorsTemplateManager {
  runtime: any;
  templates: IColorsTemplate[];
  templateById: IColorsTemplate | null;
  templateId: string | null;
  temporalTemplateId: IColorsTemplate | null;
  searchValue: string;
  loadingQuery: boolean;
  errorOnGetTemplates: boolean;
  userEmail: string;
  handlerCreateTemplate: (template: IColorsTemplateCreation) => void;
  showToast: (params: ShowToastParams) => void;
  setTemplateId: React.Dispatch<React.SetStateAction<string | null>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchTemplateById: (id: string) => void;
  restartTemplate: () => void;
  setTemporalTemplateId: React.Dispatch<React.SetStateAction<IColorsTemplate | null>>;
  searchTemplate: (param?: string | undefined) => void;
  saveChangesTemplateById: (template: IColorsTemplate) => void;
  handlerDeleteTemplate: (id: string) => void;
}

export interface UseColorsTemplateInformationManager {
  templatesInformation: IColorsTemplateInformation[];
  templatesInformationWithDelete: IColorsTemplateInformation[];
  searchValueInformation: string;
  loadingQueryInformation: boolean;
  errorOnGetTemplatesInformation: boolean;
  templateInformationToDelete: IDeleteTemplateInformation | null;
  stepProgress: number;
  finishOnDeleteTemplateInformation: FinishDeleteTemplate | null;
  currentTemplateInformationToDelete: IColorsTemplateInformation | null;
  isFinishTheUpload: boolean;
  hasBeenStartUpload: boolean;
  totalOfItemsPrevToDelete: number;
  stopDeleteTemplateInformation: boolean;
  getTemplateItemsDuplicate: number;
  haveTemplateWithoutDuplicate: IColorsTemplateInformation[];
  isModalAssignOpen: boolean;
  colorTemplateToAssign: IAssignColorTemplate | null;
  colorToUseInTheAssignation: IColors | null;
  loadingAssignDialog: boolean;
  getTemplateItemsWithoutValue: number;
  setIsModalAssignOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showToast: (params: ShowToastParams) => void;
  setColorTemplateToAssign: React.Dispatch<React.SetStateAction<IAssignColorTemplate | null>>;
  setColorToUseInTheAssignation: React.Dispatch<React.SetStateAction<IColors | null>>;
  handleConfirmationAssign: () => void;
  handleCancellationAssign: () => void;
  setTemplateInformationToDelete: React.Dispatch<React.SetStateAction<IDeleteTemplateInformation | null>>;
  setStopDeleteTemplateInformation: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchValueInformation: React.Dispatch<React.SetStateAction<string>>;
  downloadXlsFileWithTemplateInformation: () => void;
  startDeleteAllTemplateInformation: (templateToUse: IColorsTemplateInformation[]) => void;
  handleReset: (getResults?: boolean | undefined) => void;
  incrementProgress: () => void;
  runDeleteTemplatesInformation: (position: number, templateToUse: IColorsTemplateInformation[]) => void;
  handlerDeleteTemplateInformation: (id: string) => void;
  searchTemplateInformation: (param: string) => void;
  searchTemplateInformationWithId: (idTemplate: string) => void;
  runJobSearchSpec: () => void;
  removeDuplicatesTemplateInformation: () => void;
  runTemplateJob: () => void;
}
