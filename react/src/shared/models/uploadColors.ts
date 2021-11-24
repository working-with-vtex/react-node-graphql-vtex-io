import { IColorCreation, TypeColor } from './colors';
import { ShowToastParams } from './index';
import { IntlShape } from 'react-intl';

export interface UseUploadColorsManager {
  intl: IntlShape;
  isFinishTheUpload: boolean;
  isLoadingUploadFile: boolean;
  colorsList: IColorCreationConfig[];
  runtime: any;
  searchValue: string;
  stepProgress: number;
  hasBeenStartUpload: boolean;
  isModalOpen: boolean;
  listLogs: ILogsCapture[];
  errorOnReadFile: boolean;
  result: any;
  setStopDeleteColor: React.Dispatch<React.SetStateAction<boolean>>
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleReset: () => void;
  handleFile: (files: any) => void;
  setStepProgress: React.Dispatch<React.SetStateAction<number>>;
  showToast: (params: ShowToastParams) => void;
  startUpload: () => void;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

export interface IColorCreationConfig {
  colorName: string;
  sellers: string;
  variations: string;
  type: TypeColor;
  value: string;
  creationDate: string;
  isLight: boolean;
}

export interface ILogsCapture {
  colorPosition: number;
  color: IColorCreationConfig;
  message: string;
}
export interface FinishCreateColor {
  finish: boolean;
  color: IColorCreationConfig;
  position: number;
  log: ILogsCapture;
}

export interface IUploadColorManager {
  finishOnCreateColor: FinishCreateColor | null;
  showToast: (params: ShowToastParams) => void;
  handlerCreateColor: (color: IColorCreation) => void;
  setFinishOnCreateColor: React.Dispatch<React.SetStateAction<FinishCreateColor | null>>;
}
