import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { BrandsItemType, IDialogStateBrands } from '../../../../shared';
import Creation from './Creation';
import Edit from './Edit';

interface Props extends IDialogStateBrands {
  setDialogState: React.Dispatch<React.SetStateAction<IDialogStateBrands>>;
  onAddBrand: (brand: BrandsItemType) => void;
  onUpdateBrand: (brand: BrandsItemType) => void;
}

const DialogCreateBrand = (props: Props) => {
  const { open, setDialogState, message, action, brand, onAddBrand, onUpdateBrand } = props;

  const handleClose = () => {
    setDialogState({
      open: false,
      message: '',
      action: '',
      brand: undefined
    });
  };

  const onFormCommit = (brand: BrandsItemType) => {
    if (action == 'create') {
      onAddBrand(brand);
    } else if (action == 'edit') {
      onUpdateBrand(brand);
    }
    handleClose();
  };

  if (action == '' || !brand) return null;

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{message}</DialogTitle>
      {action == 'create' ? (
        <Creation {...{ handleClose, onFormCommit }} />
      ) : (
        <Edit {...{ brand, onFormCommit, handleClose }} />
      )}
    </Dialog>
  );
};

export default DialogCreateBrand;
