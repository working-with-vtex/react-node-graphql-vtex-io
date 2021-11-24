import React from 'react';
import { IColors } from '../../../../../../shared';
import styles from './index.css';

interface Props {
  color: IColors;
  setValueSearch: React.Dispatch<React.SetStateAction<string>>;
  setColors: React.Dispatch<React.SetStateAction<IColors[]>>;
  setColorToUseInTheAssignation: React.Dispatch<React.SetStateAction<IColors | null>>;
}

const ColorItemSearch = (props: Props) => {
  const { color, setValueSearch, setColors, setColorToUseInTheAssignation } = props;

  const handlerClick = () => {
    setColorToUseInTheAssignation(color);
    setValueSearch('');
    setColors([]);
  };

  return (
    <div className={styles.cardColorItem} onClick={() => handlerClick()}>
      {color.type != 'image' && <div className={styles.imageCard} style={{ background: color.value }}></div>}
      {color.type === 'image' && (
        <div className={styles.imageCard}>
          <img src={color.value} alt={color.colorName} />
        </div>
      )}
      <div>{color.colorName}</div>
    </div>
  );
};

export default ColorItemSearch;
