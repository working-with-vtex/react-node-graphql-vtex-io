import React from 'react';
import CategoryMenuAdmin from './index';
import { ToastConsumer, ToastProvider } from 'vtex.styleguide';
import { ToastRenderProps } from '../../shared';

const WrapperCategoryMenu = () => {
  return (
    <ToastProvider positioning="window">
      <ToastConsumer>
        {({ showToast }: ToastRenderProps) => <CategoryMenuAdmin {...{ showToast }} />}
      </ToastConsumer>
    </ToastProvider>
  );
};

export default WrapperCategoryMenu;
