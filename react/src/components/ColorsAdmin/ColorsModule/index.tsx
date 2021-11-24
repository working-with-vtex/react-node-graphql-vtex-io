import React from 'react';
import { PageBlock, Alert } from 'vtex.styleguide';
import { UseColorManager } from '../../../shared';
import TableColors from './components/TableColors';
import { ColorsContext } from '../../../Context';
import ProgressComponent from './components/Progress';
const { useColors } = ColorsContext;

const ColorsModule = (props: { colorManager: UseColorManager }) => {
  const {
    colorManager,
    colorManager: { hasBeenStartDelete }
  } = props;
  return (
    <div className="mb10">
      <PageBlock>
        <div className="mb4">
          <Alert type="warning">En este módulo puedes administrar los colores registrados.</Alert>
        </div>
        {hasBeenStartDelete ? <ProgressComponent /> : null}
        <TableColors {...{ colorManager }} />
      </PageBlock>
    </div>
  );
};

const WrapperApprovalModule = () => {
  const stateColors = useColors();
  if (!stateColors) return null;

  return (
    <ColorsModule
      {...{
        ...stateColors
      }}
    />
  );
};

export default WrapperApprovalModule;
