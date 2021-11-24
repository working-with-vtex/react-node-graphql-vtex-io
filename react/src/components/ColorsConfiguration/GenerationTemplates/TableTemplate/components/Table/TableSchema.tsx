import React from 'react';
import { Tag } from 'vtex.styleguide';
import { IColorsTemplate } from '../../../../../../shared';
import styles from './index.css';

export const getJsonSchema = () => {
  const jsonschema = {
    properties: {
      nameTemplate: {
        title: 'Nombre de la plantilla',
        width: 570,
        cellRenderer: ({ cellData }: any) => {
          return <div className={styles.cellNameContainer}>{cellData}</div>;
        }
      },
      total: {
        title: 'Productos',
        width: 100,
        cellRenderer: ({ cellData }: any) => {
          return <Tag>{cellData}</Tag>;
        }
      },
      sellerName: {
        title: 'Vendedor',
        width: 100,
        cellRenderer: ({ cellData }: any) => {
          return <span className={styles.cellNameContainer}>{cellData}</span>;
        }
      },
      from: {
        title: 'Estado',
        width: 120,
        cellRenderer: ({ rowData }: { rowData: IColorsTemplate }) => {
          const state =
            rowData.status == 'stopped' || rowData.status == null
              ? 'error'
              : rowData.status == 'running'
              ? 'warning'
              : 'success';
          const stateText =
            rowData.status == 'stopped' || rowData.status == null
              ? 'Sin iniciar'
              : rowData.status == 'running'
              ? 'Generando'
              : 'Generado';
          return <Tag type={state}>{stateText}</Tag>;
        }
      }
    }
  };
  return jsonschema;
};
