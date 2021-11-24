import React from 'react';
import { Layout, PageHeader } from 'vtex.styleguide';
import WrapperTabs from './WrapperTabs';

const UploadColorConfiguration = () => {
  return (
    <div>
      <Layout pageHeader={<PageHeader title="Configuración" />}>
        <WrapperTabs />
      </Layout>
    </div>
  );
};

export default UploadColorConfiguration;
