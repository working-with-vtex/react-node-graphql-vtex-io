import React from 'react';
import { PageBlock, Layout, ToastProvider, ToastConsumer } from 'vtex.styleguide';
import { ToastRenderProps } from '../../../../shared';
import { ColorConfigurationContext, SellersContext } from '../../../../Context';
import TemplateCreationForm from './TemplateCreationForm';
import { session } from 'vtex.store-resources/Queries';
import { graphql } from 'react-apollo';
import { compose, path } from 'ramda';

const { useColorsConfiguration, ColorsConfigurationProvider } = ColorConfigurationContext;
const { useSellers, SellersProvider } = SellersContext;

const TemplateCreation = (props: any) => {
  const sessionQuery = path(['sessionQuery'], props);

  return (
    <ToastProvider positioning="window">
      <ToastConsumer>
        {({ showToast }: ToastRenderProps) => (
          <ColorsConfigurationProvider {...{ showToast, sessionQuery }}>
            <SellersProvider {...{ showToast }}>
              <Layout fullWidth={false}>
                <div className="pt10">
                  <PageBlock>
                    <WrapperTemplateCreationForm />
                  </PageBlock>
                </div>
              </Layout>
            </SellersProvider>
          </ColorsConfigurationProvider>
        )}
      </ToastConsumer>
    </ToastProvider>
  );
};

const WrapperTemplateCreationForm = () => {
  const state = useColorsConfiguration();
  const sellerState = useSellers();

  if (!state || !sellerState) return null;

  return (
    <TemplateCreationForm
      {...{
        ...state,
        ...sellerState
      }}
    />
  );
};

export default compose(graphql(session, { name: 'sessionQuery' }))(TemplateCreation);
