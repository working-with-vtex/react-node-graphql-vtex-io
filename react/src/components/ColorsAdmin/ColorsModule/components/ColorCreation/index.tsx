import React from 'react';
import { PageBlock, Layout, ToastProvider, ToastConsumer } from 'vtex.styleguide';
import { ToastRenderProps } from '../../../../../shared';
import { ColorsContext } from '../../../../../Context';
import ColorFormCreation from './ColorFormCreation';
const { useColors, ColorsProvider } = ColorsContext;
const ColorCreation = () => {
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
    <ColorFormCreation
      {...{
        ...stateColors
      }}
    />
  );
};

export default ColorCreation;
