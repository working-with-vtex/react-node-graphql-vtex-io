import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import React, { useRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { IntlShape } from 'react-intl';
import {
  Button,
  Card,
  Dropzone,
  FloatingActionBar,
  ActionMenu,
  PageBlock,
  PageHeader,
  EmptyState
} from 'vtex.styleguide';
import { messages } from '../../../src/messages';
import {
  BrandsItemType,
  IDialogStateBrands,
  ShowToastParams,
  TableIcon,
  VtexBlock
} from '../../../src/shared';
import DialogCreateBrand from './components/DialogBrands';
import UploadBrandsTable from './components/Table';
import styles from './index.css';

interface Props {
  intl: IntlShape;
  errorOnReadFile: boolean;
  dialogState: IDialogStateBrands;
  finishLoad: boolean;
  blockVariation: VtexBlock;
  result: any;
  downloadUrl: string;
  downloadMarksList: BrandsItemType[];
  isLoading: boolean;
  marksList: BrandsItemType[];
  downloadUrlXls: string;
  mutationBrandResponse: BrandsItemType[];
  isMakeTheValidation: boolean;
  haveDuplicates: boolean;
  showToast: (params: ShowToastParams) => void;
  onUpdateBrand: (brand: BrandsItemType) => void;
  setDialogState: React.Dispatch<React.SetStateAction<IDialogStateBrands>>;
  onAddBrand: (brand: BrandsItemType) => void;
  removeElement: (id: string) => void;
  removeDuplicates: () => void;
  handleReset: () => void;
  handleFile: (files: any) => void;
  saveBrands: () => void;
  validateDuplicates: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      overflow: 'auto',
      maxHeight: 300
    },
    iconError: {
      color: 'red'
    },
    iconSuccess: {
      color: 'green'
    }
  })
);

const PageBrands = (props: Props) => {
  const {
    intl,
    dialogState,
    finishLoad,
    blockVariation,
    result,
    downloadUrl,
    downloadUrlXls,
    downloadMarksList,
    isLoading,
    marksList,
    mutationBrandResponse,
    isMakeTheValidation,
    haveDuplicates,
    errorOnReadFile,
    setDialogState,
    onAddBrand,
    removeDuplicates,
    handleReset,
    handleFile,
    saveBrands,
    validateDuplicates,
    onUpdateBrand,
    removeElement,
    showToast
  } = props;
  const classes = useStyles();
  const buttonJson = useRef<HTMLAnchorElement | null>(null);
  const buttonXls = useRef<HTMLAnchorElement | null>(null);

  const options = [
    {
      label: `${intl.formatMessage(messages.downloadFormat)} Json`,
      onClick: () => {
        if (buttonJson && buttonJson.current) {
          buttonJson.current.click();
        }
      }
    },
    {
      label: `${intl.formatMessage(messages.downloadFormat)} Xls`,
      onClick: () => {
        if (buttonXls && buttonXls.current) {
          buttonXls.current.click();
        }
      }
    }
  ];

  const handlerToast = (message: string) => {
    showToast({ message, duration: 3000 });
  };

  return (
    <div className="bg-muted-5 pa8">
      <DialogCreateBrand {...{ ...dialogState, setDialogState, onAddBrand, onUpdateBrand }} />

      <PageHeader
        title={intl.formatMessage(messages.uploadBrandsTitle)}
        subtitle={
          result && (
            <Button
              variation="primary"
              onClick={() =>
                setDialogState({
                  open: true,
                  message: intl.formatMessage(messages.createBrandsAction),
                  action: 'create'
                })
              }
            >
              {intl.formatMessage(messages.createBrandsAction)}
            </Button>
          )
        }
      >
        <span className="mr4">
          <ActionMenu
            label="Descargar"
            buttonProps={{
              variation: 'primary'
            }}
            options={options}
          />

          <div className={styles.actionHandlers}>
            <a ref={buttonXls} href={downloadUrlXls} download="marks-upload-format.xls">
              {`${intl.formatMessage(messages.downloadFormat)} Xls`}
            </a>
            <a ref={buttonJson} href={downloadUrl} download="marks-upload-format.json">
              {`${intl.formatMessage(messages.downloadFormat)} Json`}
            </a>
          </div>
        </span>
        {result && marksList.length > 0 && (
          <CopyToClipboard
            text={JSON.stringify({ marks: downloadMarksList })}
            onCopy={() => handlerToast(intl.formatMessage(messages.brandsCopiedSuccessfully))}
          >
            <Tooltip title={intl.formatMessage(messages.copyJson)} aria-label="copy">
              <IconButton aria-label="copy">
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
          </CopyToClipboard>
        )}
      </PageHeader>
      <PageBlock variation={blockVariation}>
        <div>
          <Dropzone
            isLoading={isLoading}
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
          {errorOnReadFile && (
            <EmptyState title={intl.formatMessage(messages.errorTitle)}>
              <p>{intl.formatMessage(messages.errorFileRead)}</p>
              <div className="pt5">
                <Button variation="secondary" size="small">
                  <a className="link" href={downloadUrl} download="marks-upload-format.json">
                    {intl.formatMessage(messages.downloadFormat)}
                  </a>
                </Button>
              </div>
            </EmptyState>
          )}
          {result && marksList.length > 0 && !errorOnReadFile && (
            <div className="mt4">
              <UploadBrandsTable {...{ marksList: marksList, removeElement, setDialogState, intl }} />
            </div>
          )}
        </div>
        {blockVariation === 'aside' && (
          <div>
            <Typography variant="h6">{intl.formatMessage(messages.creationRecordTitle)}</Typography>
            {mutationBrandResponse.length > 0 ? (
              <>
                <List className={classes.root}>
                  {mutationBrandResponse.map((item) => {
                    return (
                      <ListItem key={item.name} alignItems="flex-start">
                        {item.isCreated ? (
                          <Tooltip title={intl.formatMessage(messages.creationStateSuccessfully)}>
                            <ListItemIcon className={classes.iconSuccess}>
                              <DoneIcon />
                            </ListItemIcon>
                          </Tooltip>
                        ) : (
                          <Tooltip title={intl.formatMessage(messages.creationStateError)}>
                            <ListItemIcon className={classes.iconError}>
                              <ErrorIcon />
                            </ListItemIcon>
                          </Tooltip>
                        )}
                        <ListItemText
                          primary={item.name}
                          secondary={
                            item.isCreated
                              ? intl.formatMessage(messages.creationStateSuccessfully)
                              : intl.formatMessage(messages.creationStateError)
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
                <Button variation="secondary" onClick={() => handleReset()}>
                  {intl.formatMessage(messages.actionClear)}
                </Button>
              </>
            ) : (
              <Card>
                <h3>{intl.formatMessage(messages.createBrandsNotLog)}</h3>
                <Button variation="secondary" onClick={() => handleReset()}>
                  {intl.formatMessage(messages.actionClear)}
                </Button>
              </Card>
            )}
          </div>
        )}
      </PageBlock>
      {result && marksList.length > 0 && (
        <FloatingActionBar
          save={
            !finishLoad
              ? {
                  label: isMakeTheValidation
                    ? haveDuplicates
                      ? intl.formatMessage(messages.actionRemoveDuplicates)
                      : intl.formatMessage(messages.actionLoadBrands)
                    : intl.formatMessage(messages.actionCheckDuplicates),
                  isLoading: isLoading,
                  onClick: isMakeTheValidation
                    ? haveDuplicates
                      ? () => removeDuplicates()
                      : () => saveBrands()
                    : () => validateDuplicates()
                }
              : {}
          }
          cancel={{
            label: intl.formatMessage(messages.actionClear),
            onClick: () => handleReset()
          }}
        />
      )}
    </div>
  );
};

export default PageBrands;
