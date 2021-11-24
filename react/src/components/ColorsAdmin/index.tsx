import React from 'react';
import { Layout, PageHeader } from 'vtex.styleguide';
import WrapperTabs from './WrapperTabs';

const ColorsAdmin = () => {
  return (
      <Layout pageHeader={<PageHeader title="Administración de colores" />}>
        <WrapperTabs />
      </Layout>
  );
};

export default ColorsAdmin;
