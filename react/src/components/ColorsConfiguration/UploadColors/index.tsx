import React, { useRef } from 'react';
import { useIntl } from 'react-intl';
import { Layout, PageBlock, FloatingActionBar, ActionMenu, PageHeader } from 'vtex.styleguide';
import { messages } from '../../../messages';
import { UseUploadColorsManager } from '../../../shared';
import DropZone from './components/DropZone';
import ModalViewLog from './components/ModalViewLog';
import ProgressComponent from './components/Progress';
import { TableColorsUpload } from './components/TableColorsUpload';
import styles from './index.css';
import { ColorsContext } from '../../../Context';
import { uploadColorsFormat } from '../../../shared/files/uploadColors';
const { useColors } = ColorsContext;

interface Props {
  uploadColorsManager: UseUploadColorsManager;
}

const UploadColors = (props: Props) => {
  const { uploadColorsManager } = props;
  const { hasBeenStartUpload, isFinishTheUpload, setIsModalOpen, colorsList } = uploadColorsManager;
  const buttonJson = useRef<HTMLAnchorElement | null>(null);
  const buttonXls = useRef<HTMLAnchorElement | null>(null);
  const downloadUrl = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify({ colors: uploadColorsFormat })
  )}`;
  const downloadUrlXls =
    'https://vtex-mkp-resources.s3.amazonaws.com/content/colors/upload-color-format.xlsx';
  const intl = useIntl();

  const options = [
    // {
    //   label: `${intl.formatMessage(messages.downloadFormat)} Json`,
    //   onClick: () => {
    //     if (buttonJson && buttonJson.current) {
    //       buttonJson.current.click();
    //     }
    //   }
    // },
    {
      label: `${intl.formatMessage(messages.downloadFormat)} Xls`,
      onClick: () => {
        if (buttonXls && buttonXls.current) {
          buttonXls.current.click();
        }
      }
    }
  ];

  return (
    <div>
      <Layout fullWidth={false}>
        <PageHeader>
          <ActionMenu
            label="Descargar"
            buttonProps={{
              variation: 'primary'
            }}
            options={options}
          />
        </PageHeader>
        <PageBlock>
          <div className={styles.actionHandlers}>
            <a ref={buttonXls} href={downloadUrlXls} download="color-upload-format.xlsx">
              {`${intl.formatMessage(messages.downloadFormat)} Xls`}
            </a>
            <a ref={buttonJson} href={downloadUrl} download="color-upload-format.json">
              {`${intl.formatMessage(messages.downloadFormat)} Json`}
            </a>
          </div>
          <ModalViewLog {...{ uploadColorsManager }} />
          <DropZone {...{ uploadColorsManager }} />
          {hasBeenStartUpload ? <ProgressComponent {...{ uploadColorsManager }} /> : null}
          {colorsList ? <TableColorsUpload {...{ uploadColorsManager }} /> : null}
          {hasBeenStartUpload ? (
            <FloatingActionBar
              save={{
                label: 'Ver logs',
                isLoading: isFinishTheUpload,
                onClick: () => {
                  setIsModalOpen(true);
                }
              }}
            />
          ) : null}
        </PageBlock>
      </Layout>
    </div>
  );
};

const WrapperUploadColors = () => {
  const state = useColors();
  if (!state) return null;

  return (
    <UploadColors
      {...{
        ...state
      }}
    />
  );
};

export default WrapperUploadColors;
