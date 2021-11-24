import React from 'react';
import { ButtonWithIcon, IconDelete, Tag } from 'vtex.styleguide';
import { IDeleteSeller, ISellersColor, ShowToastParams } from '../../../../../shared';

export const getJsonSchema = ({
  slicedData,
  handleConfirmationDelete,
  showToast
}: {
  slicedData: ISellersColor[];
  handleConfirmationDelete: (seller: IDeleteSeller) => void;
  showToast: (params: ShowToastParams) => void;
}) => {
  const handlerDeleteColor = (id: string, index: number) => {
    showToast({
      message: '¿Esta seguro de eliminar el vendedor seleccionado?',
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
      sellerId: {
        title: 'ID del vendedor',
        width: 470
      },
      sellerName: {
        title: 'Nombre del vendedor',
        width: 150,
        cellRenderer: ({ cellData }: { cellData: string }) => {
          return <Tag>{cellData}</Tag>;
        }
      },
      specificationName: {
        title: '# De especificaciones',
        width: 170,
        cellRenderer: ({ cellData }: { cellData: string }) => {
          const list = cellData ? cellData.split(',') : [];
          return (
            <Tag>
              {list.length} {list.length > 1 ? 'Especificaciones' : 'Especificación'}
            </Tag>
          );
        }
      },
      id: {
        title: 'Eliminar',
        width: 70,
        cellRenderer: ({ rowData }: any) => {
          return (
            <ButtonWithIcon
              icon={<IconDelete />}
              variation="tertiary"
              onClick={(e: any) => {
                e.stopPropagation();
                const getIndexElement = (element: ISellersColor) => element.id == rowData.id;
                const index = slicedData.findIndex(getIndexElement);
                handlerDeleteColor(rowData.id, index);
              }}
            />
          );
        }
      }
    }
  };

  return jsonschema;
};
