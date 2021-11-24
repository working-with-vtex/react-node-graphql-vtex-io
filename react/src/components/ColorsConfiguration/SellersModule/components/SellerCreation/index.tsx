import React from 'react';
import { PageBlock, Layout, ToastConsumer, ToastProvider } from 'vtex.styleguide';
import { ToastRenderProps } from '../../../../../shared';
import SellerFormCreation from './SellerFormCreation';
import { SellersContext } from '../../../../../Context';
const { SellersProvider, useSellers } = SellersContext;

const ColorCreation = () => {
  return (
    <ToastProvider positioning="window">
      <ToastConsumer>
        {({ showToast }: ToastRenderProps) => (
          <Layout fullWidth={false}>
            <div className="pt10">
              <SellersProvider {...{ showToast }}>
                <PageBlock>
                  <WrapperSellerCreation />
                </PageBlock>
              </SellersProvider>
            </div>
          </Layout>
        )}
      </ToastConsumer>
    </ToastProvider>
  );
};

const WrapperSellerCreation = () => {
  const state = useSellers();
  if (!state) return null;

  return (
    <SellerFormCreation
      {...{
        ...state
      }}
    />
  );
};

export default ColorCreation;
