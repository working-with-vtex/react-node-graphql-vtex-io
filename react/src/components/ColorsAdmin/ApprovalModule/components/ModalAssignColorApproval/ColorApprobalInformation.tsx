import React from 'react';
import { IColors, IColorsApproval, IDeleteColorApproval } from '../../../../../shared';
import { Input } from 'vtex.styleguide';
import styles from './index.css';

interface Props {
  colorApprovalToAssign: IDeleteColorApproval;
  colorsApprovalList: IColorsApproval[];
  colorToUseInTheAssignation: IColors;
}

const ColorApprovalInformation = (props: Props) => {
  const { colorApprovalToAssign, colorsApprovalList, colorToUseInTheAssignation } = props;
  const color = colorsApprovalList[colorApprovalToAssign.index];

  if (!color || !colorToUseInTheAssignation) return null;

  return (
    <div className="flex flex-wrap">
      <div className="w-45">
        <h3 className="w-100">Color empleado para la asignación</h3>

        <div className={styles.containerInputs}>
          <Input
            size="small"
            disabled={true}
            label="Nombre del color"
            value={colorToUseInTheAssignation.colorName}
          />
        </div>
        <div className={styles.containerInputs}>
          <Input size="small" disabled={true} label="Color" value={colorToUseInTheAssignation.value} />
        </div>
      </div>
    </div>
  );
};

export default ColorApprovalInformation;
