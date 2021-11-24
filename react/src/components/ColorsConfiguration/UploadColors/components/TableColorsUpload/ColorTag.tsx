import React from 'react';
import { TypeColor } from '../../../../../shared';
import styles from './index.css';

interface Props {
  type: TypeColor;
  value: string;
  colorName: string;
  isLight: boolean;
}

const ColorTag = (props: Props) => {
  const { type, value, colorName, isLight } = props;
  if (type === 'color' || type === 'gradient') {
    return (
      <div
        className={`${styles.iconCheck} ${isLight ? '' : styles.iconCheckIsDark} ${
          styles.colorContainerConfig
        }`}
        style={{ background: value }}
      ></div>
    );
  } else if (type === 'image') {
    return (
      <div
        className={`${styles.iconCheck} ${isLight ? '' : styles.iconCheckIsDark} ${
          styles.colorContainerConfig
        }`}
      >
        <img src={value} alt={colorName} />
      </div>
    );
  }
  return null;
};

export default ColorTag;
