import React from 'react';
import UploadBrands from './index';
import { ToastConsumer, ToastProvider } from 'vtex.styleguide';
import { ToastRenderProps } from '../../shared';

const WrapperUploadBrands = () => {
  return (
    <ToastProvider positioning="window">
      <ToastConsumer>
        {({ showToast }: ToastRenderProps) => <UploadBrands {...{ showToast }} />}
      </ToastConsumer>
    </ToastProvider>
  );
};

export default WrapperUploadBrands;
