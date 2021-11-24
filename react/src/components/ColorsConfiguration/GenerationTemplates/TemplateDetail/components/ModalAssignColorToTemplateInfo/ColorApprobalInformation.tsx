import React from 'react';
import { Input } from 'vtex.styleguide';
import { IAssignColorTemplate, IColors, IColorsTemplateInformation } from '../../../../../../shared';
import styles from './index.css';

interface Props {
  colorTemplateToAssign: IAssignColorTemplate;
  templatesInformation: IColorsTemplateInformation[];
  colorToUseInTheAssignation: IColors;
}

const ColorApprovalInformation = (props: Props) => {
  const { colorTemplateToAssign, templatesInformation, colorToUseInTheAssignation } = props;
  const color = templatesInformation[colorTemplateToAssign.index];

  if (!color || !colorToUseInTheAssignation) return null;

  return (
    <div className="flex flex-wrap">
      <div className="w-45 mr9">
        <h3 className="w-100">Color pendiente por asignación</h3>

        <div className={styles.containerInputs}>
          <Input size="small" disabled={true} label="Variación" value={color.variations} />
        </div>
        <div className={styles.containerInputs}>
          <Input disabled={true} size="small" label="Vendedores" value={color.sellers} />
        </div>

        <div className={styles.containerInputs}>
          <Input disabled={true} size="small" label="Tipo de color" value={color.type} />
        </div>
      </div>
      <div className="w-45">
        <h3 className="w-100">Color empleado para la asignación</h3>

        <div className={styles.containerInputs}>
          <Input
            placeholder="Nombre del color"
            size="small"
            disabled={true}
            label="Nombre del color"
            value={colorToUseInTheAssignation.colorName}
          />
        </div>
        <div className={styles.containerInputs}>
          <Input
            placeholder="Valor del color"
            size="small"
            disabled={true}
            label="Valor del color"
            value={colorToUseInTheAssignation.value}
          />
        </div>

        <div className={styles.containerInputs}>
          <Input
            placeholder="Tipo de color"
            size="small"
            disabled={true}
            label="Tipo de color"
            value={colorToUseInTheAssignation.type}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorApprovalInformation;
