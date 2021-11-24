import React from 'react';
import { Progress, Button } from 'vtex.styleguide';
import { UseUploadColorsManager } from '../../../../../shared';
import styles from './index.css';

interface Props {
  uploadColorsManager: UseUploadColorsManager;
}

const ProgressComponent = (props: Props) => {
  const {
    uploadColorsManager: { setStopDeleteColor, stepProgress }
  } = props;

  return (
    <div className={styles.containerProgress}>
      <Progress type="line" percent={stepProgress} />
      <div className="mt4">
        <Button onClick={() => setStopDeleteColor(true)} variation="primary" size="small">
          Detener carga
        </Button>
      </div>
    </div>
  );
};

export default ProgressComponent;
