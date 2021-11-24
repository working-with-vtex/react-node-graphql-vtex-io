import React from 'react';
import { PageBlock, Progress, Button } from 'vtex.styleguide';
import { ColorsContext } from '../../../../../Context';
import { UseColorManager } from '../../../../../shared';
import styles from './index.css';
const { useColors } = ColorsContext;

interface Props {
  colorManager: UseColorManager;
}

const ProgressComponent = (props: Props) => {
  const {
    colorManager: { stepProgress, colorsToDelete, totalOfItemsPrevToDelete, setStopDeleteColor }
  } = props;

  return (
    <div className={styles.containerProgress}>
      <PageBlock>
        <Progress type="line" percent={stepProgress} />
        <span className="vtex-input__label mb3 w-100 mt5 pt4 flex">
          Progreso de la eliminación {colorsToDelete.length} de {totalOfItemsPrevToDelete}
        </span>
        <Button onClick={() => setStopDeleteColor(true)} variation="primary" size="small">
          Detener eliminación
        </Button>
      </PageBlock>
    </div>
  );
};

const WrapperProgress = () => {
  const state = useColors();
  if (!state) return null;

  return <ProgressComponent {...{ ...state }} />;
};

export default WrapperProgress;
