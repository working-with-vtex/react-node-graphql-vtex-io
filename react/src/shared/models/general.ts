export interface IDialogState {
  message: string;
  open: boolean;
  action: 'create' | 'edit' | '';
}

export type VtexBlock = 'full' | 'half' | 'annotated' | 'aside';

export interface ShowToastParams {
  message: string | JSX.Element;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastRenderProps {
  showToast: (params: ShowToastParams) => void;
}
