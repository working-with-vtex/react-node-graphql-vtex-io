import React from 'react';
import { PageBlock, Progress, Button } from 'vtex.styleguide';
import styles from './index.css';
import ColorConfigurationContext from '../../../../../../Context/ColorConfigurationContext';
import { UseColorsTemplateInformationManager, UseColorsTemplateManager } from '../../../../../../shared';
const { useColorsConfiguration } = ColorConfigurationContext;

interface Props {
  colorsTemplateInformationManager: UseColorsTemplateInformationManager;
  colorsTemplateManager: UseColorsTemplateManager;
}

const ProgressComponent = (props: Props) => {
  const {
    colorsTemplateInformationManager: {
      stepProgress,
      templatesInformationWithDelete,
      totalOfItemsPrevToDelete,
      setStopDeleteTemplateInformation
    }
  } = props;

  return (
    <div className={styles.containerProgress}>
      <PageBlock>
        <Progress type="line" percent={stepProgress} />
        <span className="vtex-input__label mb3 w-100 mt5 pt4 flex">
          Progreso de la eliminación {templatesInformationWithDelete.length} de {totalOfItemsPrevToDelete}
        </span>
        <Button onClick={() => setStopDeleteTemplateInformation(true)} variation="primary" size="small">
          Detener eliminación
        </Button>
      </PageBlock>
    </div>
  );
};

const WrapperProgress = () => {
  const colorConfiguration = useColorsConfiguration();
  if (!colorConfiguration) return null;

  return <ProgressComponent {...{ ...colorConfiguration }} />;
};

export default WrapperProgress;
