import { Card, CardActions, CardContent, Chip, IconButton, Tooltip, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useIntl } from 'react-intl';
import { messages } from '../../../../../messages';
import { ICategoryMenu, IDialogStateMenu, ShowToastParams } from '../../../../../shared';

interface Props {
  departments: ICategoryMenu[];
  setDialogState: React.Dispatch<React.SetStateAction<IDialogStateMenu>>;
  showToast: (params: ShowToastParams) => void;
  saveChanges: () => void;
  categories: ICategoryMenu[];
  subcategories: ICategoryMenu[];
}

const HeaderDepartments = (props: Props) => {
  const { departments, setDialogState, saveChanges, showToast, subcategories, categories } = props;
  const intl = useIntl();

  const handlerToast = (message: string) => {
    showToast({ message, duration: 3000 });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" component="h2">
          {intl.formatMessage(messages.department)}
        </Typography>
        <Chip
          variant="default"
          size="small"
          label={`${departments.length} ${intl.formatMessage(messages.department)}`}
          color="primary"
        />
      </CardContent>
      <CardActions>
        <Tooltip title={intl.formatMessage(messages.createDepartment)} aria-label="create">
          <IconButton
            onClick={() =>
              setDialogState({
                department: null,
                open: true,
                message: intl.formatMessage(messages.createDepartment),
                action: 'create',
                typeForm: 'department'
              })
            }
            aria-label="create"
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
        {departments.length ? (
          <Tooltip title={intl.formatMessage(messages.publishChanges)} aria-label="upload">
            <IconButton onClick={() => saveChanges()} aria-label="upload">
              <CloudUploadIcon />
            </IconButton>
          </Tooltip>
        ) : null}

        {departments.length ? (
          <CopyToClipboard
            text={JSON.stringify({ categories: [...departments, ...categories, ...subcategories] })}
            onCopy={() => handlerToast(intl.formatMessage(messages.copiedJson))}
          >
            <Tooltip title={intl.formatMessage(messages.copyJson)} aria-label="copy">
              <IconButton aria-label="copy">
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
          </CopyToClipboard>
        ) : null}
      </CardActions>
    </Card>
  );
};
export default HeaderDepartments;
