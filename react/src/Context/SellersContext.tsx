import React, { createContext, PropsWithChildren, useContext } from 'react';
import { ShowToastParams, UseSellersManager, useSellersManager } from '../shared';

const SellersContext = createContext<State | undefined>(undefined);

export interface State {
  sellersManager: UseSellersManager;
}

interface ProviderProps {
  showToast: (params: ShowToastParams) => void;
}

function SellersProvider({ showToast, children }: PropsWithChildren<ProviderProps>) {
  const sellersManager = useSellersManager({
    showToast
  });

  return (
    <SellersContext.Provider
      value={{
        sellersManager
      }}
    >
      {children}
    </SellersContext.Provider>
  );
}

function useSellers() {
  return useContext(SellersContext);
}

export default {
  SellersProvider,
  useSellers
};
