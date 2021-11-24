import React from 'react';
import { ButtonWithIcon, IconDelete, IconPlus, Input, Tag } from 'vtex.styleguide';
import {
  IAssignColorTemplate,
  IColorsTemplateInformation,
  IDeleteTemplateInformation
} from '../../../../../../shared';

export const getJsonSchema = ({
  slicedData,
  setTemplateInformationToDelete,
  setIsModalAssignOpen,
  setColorTemplateToAssign,
  handlerDeleteTemplateInformation
}: {
  slicedData: IColorsTemplateInformation[];
  handlerDeleteTemplateInformation: (id: string) => void;
  setIsModalAssignOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setColorTemplateToAssign: React.Dispatch<React.SetStateAction<IAssignColorTemplate | null>>;
  setTemplateInformationToDelete: React.Dispatch<React.SetStateAction<IDeleteTemplateInformation | null>>;
}) => {
  const handlerAssignColor = (id: string, index: number) => {
    setColorTemplateToAssign({
      id,
      index
    });
    setIsModalAssignOpen(true);
  };

  const jsonschema = {
    properties: {
      id: {
        title: 'Asignar',
        width: 80,
        cellRenderer: ({ rowData }: { rowData: IColorsTemplateInformation }) => {
          return (
            <ButtonWithIcon
              icon={<IconPlus />}
              variation="secondary"
              onClick={(e: any) => {
                e.stopPropagation();
                const getIndexElement = (element: IColorsTemplateInformation) => element.id == rowData.id;
                const index = slicedData.findIndex(getIndexElement);
                handlerAssignColor(rowData.id, index);
              }}
            ></ButtonWithIcon>
          );
        }
      },
      colorName: {
        title: 'Nombre del color a emplear',
        width: 250,
        cellRenderer: ({ cellData }: any) => {
          return <Input disabled value={cellData} />;
        }
      },
      variations: {
        title: 'Variación',
        width: 150,
        cellRenderer: ({ rowData }: { rowData: IColorsTemplateInformation }) => {
          if (rowData.variations != '') {
            return (
              <div>
                <Tag>{rowData.variations}</Tag>
              </div>
            );
          }
          return null;
        }
      },
      sellers: {
        title: 'Vendedor',
        width: 100,
        cellRenderer: ({ rowData }: { rowData: IColorsTemplateInformation }) => {
          if (rowData.sellers != '') {
            return (
              <div>
                <Tag>{rowData.sellers}</Tag>
              </div>
            );
          }
          return null;
        }
      },
      type: {
        title: 'Tipo',
        width: 100,
        cellRenderer: ({ rowData }: { rowData: IColorsTemplateInformation }) => {
          if (rowData.type != '') {
            return (
              <div>
                <Tag>{rowData.type}</Tag>
              </div>
            );
          }
          return null;
        }
      },

      creationDate: {
        title: 'Eliminar',
        width: 100,
        cellRenderer: ({ rowData }: any) => {
          return (
            <ButtonWithIcon
              icon={<IconDelete />}
              variation="tertiary"
              onClick={(e: any) => {
                e.stopPropagation();
                const getIndexElement = (element: IColorsTemplateInformation) => element.id == rowData.id;
                const index = slicedData.findIndex(getIndexElement);
                setTemplateInformationToDelete({ id: rowData.id, index });
                handlerDeleteTemplateInformation(rowData.id);
              }}
            />
          );
        }
      }
    }
  };
  return jsonschema;
};
