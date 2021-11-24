import React from 'react';
import { ButtonWithIcon, IconDelete, Tag } from 'vtex.styleguide';
import { IColors, IDeleteColor, ShowToastParams } from '../../../../../shared';
import ColorTag from './ColorTag';
import styles from './index.css';

export const getJsonSchema = ({
  handleConfirmationDelete,
  slicedData,
  showToast
}: {
  slicedData: IColors[];
  showToast: (params: ShowToastParams) => void;
  handleConfirmationDelete: (color: IDeleteColor) => void;
}) => {
  const handlerDeleteColor = (id: string, index: number) => {
    showToast({
      message: '¿Esta seguro de eliminar el color seleccionado?',
      action: {
        label: 'Eliminar',
        onClick: () =>
          handleConfirmationDelete({
            id,
            index
          })
      }
    });
  };

  const jsonschema = {
    properties: {
      name: {
        title: 'Color',
        width: 320,
        cellRenderer: ({ rowData }: any) => {
          return (
            <div className={styles.iconColorContainer}>
              <ColorTag {...{ ...rowData }} />
              <div className={styles.textElement}>{rowData.colorName}</div>
            </div>
          );
        }
      },
      variations: {
        title: '# De variaciones',
        width: 170,
        cellRenderer: ({ cellData }: { cellData: string }) => {
          const list = cellData && cellData !== '' ? cellData.split(',') : [];
          return (
            <Tag>
              {list.length} {list.length > 1 ? 'Variaciones' : 'Variación'}
            </Tag>
          );
        }
      },
      sellers: {
        title: '# De vendedores',
        width: 170,
        cellRenderer: ({ cellData }: { cellData: string }) => {
          const list = cellData && cellData !== '' ? cellData.split(',') : [];
          return (
            <Tag>
              {list.length} {list.length > 1 ? 'Vendedores' : 'Vendedor'}
            </Tag>
          );
        }
      },
      type: {
        title: 'Tipo',
        width: 100,
        cellRenderer: ({ cellData }: any) => {
          return <Tag size="small">{cellData}</Tag>;
        }
      },
      creationDate: {
        title: 'Eliminar',
        width: 100,
        cellRenderer: ({ rowData }: { rowData: IColors }) => {
          return (
            <ButtonWithIcon
              icon={<IconDelete />}
              variation="tertiary"
              onClick={(e: any) => {
                e.stopPropagation();
                const getIndexElement = (element: IColors) => element.idMasterData == rowData.idMasterData;
                const index = slicedData.findIndex(getIndexElement);
                handlerDeleteColor(rowData.idMasterData, index);
              }}
            />
          );
        }
      }
    }
  };
  return jsonschema;
};
