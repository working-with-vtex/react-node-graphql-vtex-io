import React from 'react';
import { PageBlock, Alert } from 'vtex.styleguide';
import { UseColorApprovalManager, UseColorManager } from '../../../shared';
import ModalAssignColorApproval from './components/ModalAssignColorApproval';
import TableApprovalColor from './components/TableApprovalColor';
import { ColorsApprovalContext, ColorsContext } from '../../../Context';
const { useColorsApproval } = ColorsApprovalContext;
const { useColors } = ColorsContext;

const ApprovalModule = ({
  colorApprovalManager,
  colorManager
}: {
  colorApprovalManager: UseColorApprovalManager;
  colorManager: UseColorManager;
}) => {
  return (
    <PageBlock>
      <div className="mb4">
        <Alert type="warning">
          En este módulo puedes administrar los colores pendientes por aprobación y visualizar los que ya han
          sido aprobados
        </Alert>
      </div>
      <ModalAssignColorApproval {...{ colorApprovalManager, colorManager }} />
      <TableApprovalColor {...{ colorApprovalManager, colorManager }} />
    </PageBlock>
  );
};

const WrapperApprovalModule = () => {
  const stateApproval = useColorsApproval();
  const stateColors = useColors();
  if (!stateApproval || !stateColors) return null;

  return (
    <ApprovalModule
      {...{
        ...stateApproval,
        ...stateColors
      }}
    />
  );
};

export default WrapperApprovalModule;
