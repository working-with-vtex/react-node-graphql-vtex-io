import React, { createContext, PropsWithChildren, useContext } from 'react';
import {
  ShowToastParams,
  UseColorManager,
  UseUploadColorsManager,
  useColorManager,
  useUploadColorsManager
} from '../shared';

const ColorsContext = createContext<State | undefined>(undefined);

export interface State {
  colorManager: UseColorManager;
  uploadColorsManager: UseUploadColorsManager;
}

interface ProviderProps {
  showToast: (params: ShowToastParams) => void;
}

function ColorsProvider({ showToast, children }: PropsWithChildren<ProviderProps>) {
  const colorManager = useColorManager({ showToast });
  const { handlerCreateColor, finishOnCreateColor, setFinishOnCreateColor } = colorManager;

  const uploadColorsManager = useUploadColorsManager({
    showToast,
    handlerCreateColor,
    finishOnCreateColor,
    setFinishOnCreateColor
  });

  return (
    <ColorsContext.Provider
      value={{
        uploadColorsManager,
        colorManager
      }}
    >
      {children}
    </ColorsContext.Provider>
  );
}

function useColors() {
  return useContext(ColorsContext);
}

export default {
  ColorsProvider,
  useColors
};
