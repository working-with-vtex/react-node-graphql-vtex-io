import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { ICategoryMenu, IDialogStateMenu, typeForm } from '../../../../shared';
import Creation from './Creation';
import Edit from './Edit';

interface Props extends IDialogStateMenu {
  setDialogState: React.Dispatch<React.SetStateAction<IDialogStateMenu>>;
  onAddCategories: (category: ICategoryMenu, department: number | null, typeForm: typeForm) => void;
  onUpdateCategories: (department: ICategoryMenu, typeForm: typeForm) => void;
}

const DialogCreateCategory = (props: Props) => {
  const {
    open,
    setDialogState,
    message,
    action,
    typeForm,
    department,
    category,
    onAddCategories,
    onUpdateCategories
  } = props;

  const handleClose = () => {
    setDialogState({
      open: false,
      message: '',
      action: '',
      typeForm: ''
    });
  };

  const onFormCommit = (category: ICategoryMenu) => {
    if (typeForm == 'department' && action == 'create') {
      onAddCategories(category, null, typeForm);
    } else if (typeForm == 'department' && action == 'edit') {
      onUpdateCategories(category, typeForm);
    } else if (
      (typeForm == 'subcategory' && action == 'create') ||
      (typeForm == 'category' && action == 'create')
    ) {
      if (department) {
        onAddCategories(category, department, typeForm);
      }
    }
    if ((typeForm == 'subcategory' && action == 'edit') || (typeForm == 'category' && action == 'edit')) {
      onUpdateCategories(category, typeForm);
    }
    handleClose();
  };

  if (action == '' || !category) return null;

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{message}</DialogTitle>
      {action == 'create' ? (
        <Creation {...{ handleClose, onFormCommit }} />
      ) : (
        <Edit {...{ category, onFormCommit, handleClose }} />
      )}
    </Dialog>
  );
};

export default DialogCreateCategory;
