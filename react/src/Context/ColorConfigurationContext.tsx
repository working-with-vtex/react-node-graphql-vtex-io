import React, { createContext, PropsWithChildren, useContext } from 'react';
import {
  ShowToastParams,
  useColorsTemplateInformationManager,
  UseColorsTemplateManager,
  UseColorsTemplateInformationManager,
  useColorsTemplateManager
} from '../shared';

const ColorsConfigurationContext = createContext<State | undefined>(undefined);

export interface State {
  colorsTemplateManager: UseColorsTemplateManager;
  colorsTemplateInformationManager: UseColorsTemplateInformationManager;
}

interface ProviderProps {
  showToast: (params: ShowToastParams) => void;
  sessionQuery?: any;
}

function ColorsConfigurationProvider({
  showToast,
  sessionQuery,
  children
}: PropsWithChildren<ProviderProps>) {
  const colorsTemplateManager = useColorsTemplateManager({
    showToast,
    sessionQuery
  });
  const colorsTemplateInformationManager = useColorsTemplateInformationManager({
    colorsTemplateManager
  });

  return (
    <ColorsConfigurationContext.Provider
      value={{
        colorsTemplateManager,
        colorsTemplateInformationManager
      }}
    >
      {children}
    </ColorsConfigurationContext.Provider>
  );
}

function useColorsConfiguration() {
  return useContext(ColorsConfigurationContext);
}

export default {
  ColorsConfigurationProvider,
  useColorsConfiguration
};
