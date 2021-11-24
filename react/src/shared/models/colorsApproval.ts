import { IColors } from './colors';
import { ShowToastParams } from './general';

export interface IColorsApproval {
  name: string;
  creationDate: string;
  state: string;
  specificationName: string;
  specificationValue: string;
  id: string;
  sellerId: string;
}

export interface IDeleteColorApproval {
  id: string;
  index: number;
}

export type StateFilter = 'assigned' | 'pending';

export interface UseColorApprovalManager {
  colorsApprovalList: IColorsApproval[];
  colorToUseInTheAssignation: IColors | null;
  loadingQuery: boolean;
  runtime: any;
  searchValue: string;
  loadingAssignDialog: boolean;
  colorApprovalToAssign: IDeleteColorApproval | null;
  isModalAssignOpen: boolean;
  searchColorWithState: (state: StateFilter) => void;
  setIsModalAssignOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setColorApprovalToAssign: React.Dispatch<React.SetStateAction<IDeleteColorApproval | null>>;
  handleConfirmationAssign: () => void;
  handleCancellationAssign: () => void;
  searchColorsApproval: (param?: string | undefined) => void;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  handleConfirmationDelete: (color: IDeleteColorApproval) => void;
  saveChangesColorApprovalById: (color: IColorsApproval) => void;
  setColorToUseInTheAssignation: React.Dispatch<React.SetStateAction<IColors | null>>;
  showToast: (params: ShowToastParams) => void;
}

export type TabsDistribution = 'colors' | 'approbation';
