import React from 'react';
import { PageBlock, Alert } from 'vtex.styleguide';
import TableSellers from './components/TableSellers';

const SellersModule = () => {
  return (
    <PageBlock>
      <div className="mb4">
        <Alert type="warning">
          En este módulo puedes crear los sellers que van a ser empleados por el sistema
          automatizado para obtener las especificaciones de los productos que envíen los sellers
        </Alert>
      </div>
      <TableSellers />
    </PageBlock>
  );
};

export default SellersModule;
