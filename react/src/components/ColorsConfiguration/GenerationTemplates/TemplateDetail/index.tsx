import React from 'react';
import { Layout, ToastProvider, ToastConsumer } from 'vtex.styleguide';
import { ToastRenderProps } from '../../../../shared';
import { ColorConfigurationContext, SellersContext, ColorsContext } from '../../../../Context';
import TemplateInformation from './components/TemplateInformation';
const { ColorsConfigurationProvider } = ColorConfigurationContext;
const { ColorsProvider } = ColorsContext;
const { SellersProvider } = SellersContext;

const TemplateDetail = () => {
  return (
    <ToastProvider positioning="window">
      <ToastConsumer>
        {({ showToast }: ToastRenderProps) => (
          <ColorsConfigurationProvider {...{ showToast }}>
            <SellersProvider {...{ showToast }}>
              <ColorsProvider {...{ showToast }}>
                <Layout fullWidth={false}>
                  <TemplateInformation />
                </Layout>
              </ColorsProvider>
            </SellersProvider>
          </ColorsConfigurationProvider>
        )}
      </ToastConsumer>
    </ToastProvider>
  );
};

export default TemplateDetail;
