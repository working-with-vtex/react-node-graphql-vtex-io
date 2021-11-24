import React from 'react';
import { Button, IconDelete, Tag, ButtonWithIcon } from 'vtex.styleguide';
import { IColors, IColorsApproval, IDeleteColorApproval, ShowToastParams } from '../../../../../shared';

export const getJsonSchema = ({
  handleConfirmationDelete,
  slicedData,
  showToast,
  setColorApprovalToAssign,
  setIsModalAssignOpen,
  setColors
}: {
  slicedData: IColorsApproval[];
  setColorApprovalToAssign: React.Dispatch<React.SetStateAction<IDeleteColorApproval | null>>;
  showToast: (params: ShowToastParams) => void;
  handleConfirmationDelete: (color: IDeleteColorApproval) => void;
  setIsModalAssignOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setColors: React.Dispatch<React.SetStateAction<IColors[]>>;
}) => {
  const handlerDeleteColor = (id: string, index: number) => {
    showToast({
      message: '¿Esta seguro de eliminar el elemento seleccionado?',
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

  const handlerAssignColor = (id: string, index: number) => {
    setColorApprovalToAssign({
      id,
      index
    });
    setColors([]);
    setIsModalAssignOpen(true);
  };

  const jsonschema = {
    properties: {
      sellerId: {
        title: 'Vendedor',
        width: 600
      },

      state: {
        title: 'Estado',
        width: 120,
        cellRenderer: ({ cellData }: any) => {
          const state = cellData == 'assigned' ? 'success' : cellData == 'pending' ? 'warning' : 'warning';
          return <Tag type={state}>{cellData == 'assigned' ? 'Asignado' : 'Pendiente'}</Tag>;
        }
      },
      // specificationName: {
      //   title: 'Especificación - Valor',
      //   width: 150
      // },

      specificationValue: {
        title: 'Asignar',
        width: 120,
        cellRenderer: ({ rowData }: any) => {
          return (
            <Button
              disabled={rowData.state == 'assigned'}
              onClick={(e: any) => {
                e.stopPropagation();
                const getIndexElement = (element: IColorsApproval) => element.id == rowData.id;
                const index = slicedData.findIndex(getIndexElement);
                handlerAssignColor(rowData.id, index);
              }}
              variation="primary"
              size="small"
            >
              Asignar
            </Button>
          );
        }
      },
      id: {
        title: 'Eliminar',
        width: 100,
        cellRenderer: ({ rowData }: any) => {
          return (
            <ButtonWithIcon
              icon={<IconDelete />}
              variation="tertiary"
              onClick={(e: any) => {
                e.stopPropagation();
                const getIndexElement = (element: IColorsApproval) => element.id == rowData.id;
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
