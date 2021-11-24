import React from 'react';
import { Input, Tag } from 'vtex.styleguide';
import ColorTag from './ColorTag';
import styles from './index.css';

export const getJsonSchema = () => {
  const jsonschema = {
    properties: {
      colorName: {
        title: 'Color',
        width: 150,
        cellRenderer: ({ rowData }: any) => {
          return (
            <div className={styles.iconColorContainer}>
              <ColorTag {...{ ...rowData }} />
              <div className={styles.textElement}>{rowData.colorName}</div>
            </div>
          );
        }
      },
      value: {
        title: 'Valor',
        width: 160,
        cellRenderer: ({ cellData }: any) => {
          return <Input disabled value={cellData} />;
        }
      },
      type: {
        title: 'Tipo',
        width: 100,
        cellRenderer: ({ cellData }: any) => {
          return <Tag size="small">{cellData}</Tag>;
        }
      },
      sellers: {
        title: 'Sellers',
        width: 200,
        cellRenderer: ({ cellData }: any) => {
          return <Input disabled value={cellData} />;
        }
      },
      variations: {
        title: 'Variaciones',
        width: 220,
        cellRenderer: ({ cellData }: any) => {
          return <Input disabled value={cellData} />;
        }
      }
    }
  };
  return jsonschema;
};
