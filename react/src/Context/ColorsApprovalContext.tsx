import React, { createContext, PropsWithChildren, useContext } from 'react';
import { ShowToastParams, useColorApprovalManager, UseColorApprovalManager } from '../shared';

const ColorsApprovalContext = createContext<State | undefined>(undefined);

export interface State {
  colorApprovalManager: UseColorApprovalManager;
}

interface ProviderProps {
  showToast: (params: ShowToastParams) => void;
}

function ColorsApprovalProvider({ showToast, children }: PropsWithChildren<ProviderProps>) {
  const colorApprovalManager = useColorApprovalManager({ showToast });

  return (
    <ColorsApprovalContext.Provider
      value={{
        colorApprovalManager
      }}
    >
      {children}
    </ColorsApprovalContext.Provider>
  );
}

function useColorsApproval() {
  return useContext(ColorsApprovalContext);
}

export default {
  ColorsApprovalProvider,
  useColorsApproval
};
