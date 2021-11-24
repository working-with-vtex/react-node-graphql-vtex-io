import React from 'react';
import TableTemplates from './components/Table';
import { PageBlock, Alert } from 'vtex.styleguide';

const ColorsGenerationTemplate = () => {
  return (
    <PageBlock>
      <div className="mb4">
        <Alert type="warning">
          En este módulo puedes generar plantillas '.xls' con los productos pendientes por aprobar.
        </Alert>
      </div>
      <TableTemplates />
    </PageBlock>
  );
};

export default ColorsGenerationTemplate;
