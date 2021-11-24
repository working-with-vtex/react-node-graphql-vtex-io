import { Chip, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';
import { useIntl } from 'react-intl';
import { messages } from '../../../messages';
import { BrandsItemType, IDialogStateBrands, stopPropagation } from '../../../shared';

interface Props {
  brand: BrandsItemType;
  removeElement: (id: string) => void;
  setDialogState: React.Dispatch<React.SetStateAction<IDialogStateBrands>>;
}

const ListOptions = (props: Props) => {
  const { brand, removeElement, setDialogState } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const intl = useIntl();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    stopPropagation(event);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: any) => {
    stopPropagation(event);
    setAnchorEl(null);
  };

  return (
    <>
      <Chip
        icon={<MoreVertIcon />}
        label={intl.formatMessage(messages.actionOptions)}
        clickable
        color="primary"
        aria-controls="department-action-menu"
        aria-haspopup="true"
        onClick={handleClick}
      />

      <Menu
        id="department-action-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={(e: any) => {
            stopPropagation(e);
            handleClose(e);
            setDialogState({
              brand,
              open: true,
              message: intl.formatMessage(messages.actionEdit),
              action: 'edit'
            });
          }}
        >
          {intl.formatMessage(messages.actionEdit)}
        </MenuItem>
        <MenuItem
          onClick={(e: any) => {
            stopPropagation(e);
            handleClose(e);
            removeElement(brand.id);
          }}
        >
          {intl.formatMessage(messages.actionDelete)}
        </MenuItem>
      </Menu>
    </>
  );
};
export default ListOptions;
