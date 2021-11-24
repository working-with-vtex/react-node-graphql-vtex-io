import React, { useState } from 'react';
import { Collapsible } from 'vtex.styleguide';
import { PropsTemplateConfiguration } from './TemplateConfiguration';
import TemplateConfiguration from './TemplateConfiguration';

const WrapperTemplateConfiguration = (props: PropsTemplateConfiguration) => {
  const {
    colorsTemplateManager: { temporalTemplateId }
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  const handlerOpenConfiguration = (status: boolean) => {
    if (temporalTemplateId?.status != 'running') {
      setIsOpen(status);
    } else {
      setIsOpen(false);
    }
  };

  if (!temporalTemplateId) return null;

  return (
    <div className="mt5">
      <Collapsible
        header={<span className="c-action-primary hover-c-action-primary fw5">Configuración avanzada.</span>}
        onClick={(e: any) => handlerOpenConfiguration(e.target.isOpen)}
        isOpen={isOpen && temporalTemplateId?.status != 'running'}
      >
        <TemplateConfiguration {...{ ...props }} />
      </Collapsible>
    </div>
  );
};

export default WrapperTemplateConfiguration;
