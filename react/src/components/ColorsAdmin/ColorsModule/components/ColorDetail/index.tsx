import React from 'react';
import { Layout, PageBlock, ToastConsumer, ToastProvider } from 'vtex.styleguide';
import { ToastRenderProps } from '../../../../../shared';
import ColorInformation from './ColorInformation';
import { ColorsContext } from '../../../../../Context';
const { useColors, ColorsProvider } = ColorsContext;

const ColorDetail = () => {
  return (
    <ToastProvider positioning="window">
      <ToastConsumer>
        {({ showToast }: ToastRenderProps) => (
          <ColorsProvider {...{ showToast }}>
            <Layout fullWidth={false}>
              <div className="pt5">
                <PageBlock>
                  <WrapperApprovalModule />
                </PageBlock>
              </div>
            </Layout>
          </ColorsProvider>
        )}
      </ToastConsumer>
    </ToastProvider>
  );
};

const WrapperApprovalModule = () => {
  const stateColors = useColors();
  if (!stateColors) return null;

  return (
    <ColorInformation
      {...{
        ...stateColors
      }}
    />
  );
};

export default ColorDetail;
