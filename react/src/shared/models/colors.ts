import { ShowToastParams } from './general';
import { FinishCreateColor } from './uploadColors';
export interface UseColorManager {
  loadingQuery: boolean;
  errorOnGetColors: boolean;
  colors: IColors[];
  runtime?: any;
  colorById: IColors | null;
  searchValue: string;
  getColorsDuplicate: number;
  finishOnCreateColor: FinishCreateColor | null;
  tempColor: IColors | null;
  stepProgress: number;
  isFinishTheDelete: boolean;
  hasBeenStartDelete: boolean;
  totalOfItemsPrevToDelete: number;
  colorsToDelete: IColors[];
  setStopDeleteColor: React.Dispatch<React.SetStateAction<boolean>>;
  downloadXlsFileWithColors: () => void;
  handlerDeleteColors: (information: BulkActions) => void;
  showToast: (params: ShowToastParams) => void;
  setFinishOnCreateColor: React.Dispatch<React.SetStateAction<FinishCreateColor | null>>;
  searchColors: (param?: string) => void;
  searchColorsById: (id: string) => void;
  saveChangesColorById: (color: IColors) => void;
  setColorById: React.Dispatch<React.SetStateAction<IColors | null>>;
  handlerCreateColor: (color: IColorCreation) => void;
  handleConfirmationDelete: (color: IDeleteColor) => void;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setColors: React.Dispatch<React.SetStateAction<IColors[]>>;
  setTempColor: React.Dispatch<React.SetStateAction<IColors | null>>;
  setStepProgress: React.Dispatch<React.SetStateAction<number>>;
}

export interface FinishDeleteColors {
  finish: boolean;
  color: IColors;
  position: number;
}

export interface IDeleteColor {
  id: string;
  index: number;
}

export interface IColorBase {
  colorName: string;
  value: string;
  creationDate: string;
  type: TypeColor;
  variations: string;
  sellers: string;
  isLight: boolean;
}

export interface IColors extends IColorBase {
  id: string;
  idMasterData: string;
}

export interface IColorCreation extends IColorBase {}

export type TypeColor = 'color' | 'image' | 'gradient';

export interface ColorSearchApiResponse {
  status: number;
  message: String;
  data: {
    colors: IColors[];
  };
}

export interface BulkActions {
  selectedRows?: IColors[];
  allLinesSelected?: boolean;
}
