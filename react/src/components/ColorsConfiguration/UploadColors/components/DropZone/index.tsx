import React from 'react';
import { Dropzone } from 'vtex.styleguide';
import { messages } from '../../../../../messages';
import { TableIcon, UseUploadColorsManager } from '../../../../../shared';

interface Props {
  uploadColorsManager: UseUploadColorsManager;
}

const DropZone = (props: Props) => {
  const {
    uploadColorsManager: { intl, isLoadingUploadFile, handleFile, handleReset }
  } = props;
  return (
    <Dropzone
      isLoading={isLoadingUploadFile}
      icon={TableIcon}
      onDropAccepted={handleFile}
      onFileReset={handleReset}
    >
      <div className="pt7">
        <div>
          <span className="f4">{intl.formatMessage(messages.dropJsonTitle)} </span>
          <span className="f4 c-link" style={{ cursor: 'pointer' }}>
            {intl.formatMessage(messages.dropJsonAction)}
          </span>
        </div>
      </div>
    </Dropzone>
  );
};

export default DropZone;
