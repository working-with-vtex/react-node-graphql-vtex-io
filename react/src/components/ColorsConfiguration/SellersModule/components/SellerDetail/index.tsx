import React from 'react';
import { PageBlock, Layout, ToastProvider, ToastConsumer } from 'vtex.styleguide';
import { ToastRenderProps } from '../../../../../shared';
import { SellersContext } from '../../../../../Context';
import SellerInformation from './SellerInformation';
const { SellersProvider, useSellers } = SellersContext;

const ColorDetail = () => {
  return (
    <ToastProvider positioning="window">
      <ToastConsumer>
        {({ showToast }: ToastRenderProps) => (
          <Layout fullWidth={false}>
            <div className="pt10">
              <SellersProvider {...{ showToast }}>
                <PageBlock>
                  <WrapperSellerDetail />
                </PageBlock>
              </SellersProvider>
            </div>
          </Layout>
        )}
      </ToastConsumer>
    </ToastProvider>
  );
};

const WrapperSellerDetail = () => {
  const state = useSellers();
  if (!state) return null;

  return (
    <SellerInformation
      {...{
        ...state
      }}
    />
  );
};

export default ColorDetail;
