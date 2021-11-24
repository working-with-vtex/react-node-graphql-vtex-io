import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import React from 'react';
import { useIntl } from 'react-intl';
import { messages } from '../../../../messages';
import { ICategoryMenu, IDeleteDialogState, typeForm } from '../../../../shared';

interface Props {
  information: IDeleteDialogState;
  setDialogDeleteState: React.Dispatch<React.SetStateAction<IDeleteDialogState>>;
  deleteCategories: (category: ICategoryMenu, typeCategory: typeForm) => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteCategoryDialog = (props: Props) => {
  const intl = useIntl();
  const { setDialogDeleteState, deleteCategories } = props;
  const { category, typeCategory, open } = props.information;

  const handleDelete = () => {
    if (category) {
      deleteCategories(category, typeCategory);
    }
    setDialogDeleteState({ typeCategory: '', category: null, open: false });
  };

  const handleClose = () => {
    setDialogDeleteState({ typeCategory: '', category: null, open: false });
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{intl.formatMessage(messages.deleteAlertTitle)}</DialogTitle>
      <DialogContent>
        {typeCategory == 'department' && (
          <DialogContentText id="alert-dialog-slide-description">
            {intl.formatMessage(messages.deleteAlertMessageDepartment)}
          </DialogContentText>
        )}
        {typeCategory == 'category' && (
          <DialogContentText id="alert-dialog-slide-description">
            {intl.formatMessage(messages.deleteAlertMessageCategory)}
          </DialogContentText>
        )}
        {typeCategory == 'subcategory' && (
          <DialogContentText id="alert-dialog-slide-description">
            {intl.formatMessage(messages.deleteAlertMessageSubCategory)}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {intl.formatMessage(messages.actionCancel)}
        </Button>
        <Button onClick={handleDelete} color="primary" variant="contained">
          {intl.formatMessage(messages.actionAgree)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCategoryDialog;
