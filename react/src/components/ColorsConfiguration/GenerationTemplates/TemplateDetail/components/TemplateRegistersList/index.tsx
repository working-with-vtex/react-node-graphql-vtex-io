import React, { useEffect, useState } from 'react';
import { PageBlock, Tag } from 'vtex.styleguide';
import TableTemplatesInformation from '../TableTemplatesInformation';
import { UseColorsTemplateInformationManager, UseColorsTemplateManager } from '../../../../../../shared';

interface Props {
  colorsTemplateInformationManager: UseColorsTemplateInformationManager;
  colorsTemplateManager: UseColorsTemplateManager;
}

interface ITagState {
  color: string;
  name: string;
}

const TemplateRegistersList = (props: Props) => {
  const {
    colorsTemplateInformationManager: { searchTemplateInformation, searchTemplateInformationWithId },
    colorsTemplateManager: { templateId, temporalTemplateId }
  } = props;
  const [tagColorStatus, setTagColorStatus] = useState<ITagState | null>(null);

  useEffect(() => {
    handlerSearchTemplates();
  }, []);

  useEffect(() => {
    if (temporalTemplateId) {
      const tagState: ITagState = {
        color:
          temporalTemplateId.status == 'stopped'
            ? 'error'
            : temporalTemplateId.status == 'running'
            ? 'warning'
            : 'success',
        name:
          temporalTemplateId.status == 'stopped'
            ? 'Sin iniciar'
            : temporalTemplateId.status == 'running'
            ? 'Generando'
            : 'Generado'
      };
      setTagColorStatus(tagState);
    }
  }, [temporalTemplateId]);

  const handlerSearchTemplates = (param?: string) => {
    if (param) {
      searchTemplateInformation(param);
    } else {
      if (templateId) {
        searchTemplateInformationWithId(templateId);
      }
    }
  };

  if (!temporalTemplateId) {
    return null;
  }

  return (
    <PageBlock
      variation="full"
      title="Especificaciones generadas"
      subtitle={
        <div className="flex items-center">
          <Tag>{temporalTemplateId.nameTemplate}</Tag>
          {tagColorStatus ? (
            <div className="ml3">
              <Tag type={tagColorStatus.color}>{tagColorStatus.name}</Tag>
            </div>
          ) : null}
        </div>
      }
    >
      <TableTemplatesInformation {...{ handlerSearchTemplates }} />
    </PageBlock>
  );
};

export default TemplateRegistersList;
