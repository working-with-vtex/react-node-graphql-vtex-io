import { Chip, IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import WarningIcon from '@material-ui/icons/Warning';
import React from 'react';
import { useIntl } from 'react-intl';
import { messages } from '../../../../../messages';
import { ICategoryMenu, IDeleteDialogState, IDialogStateMenu, stopPropagation } from '../../../../../shared';

interface Props {
  setDialogState: (value: React.SetStateAction<IDialogStateMenu>) => void;
  categorySelected: ICategoryMenu | null;
  category: ICategoryMenu;
  setDialogDeleteState: React.Dispatch<React.SetStateAction<IDeleteDialogState>>;
}

const ListOptions = (props: Props) => {
  const { category, setDialogState, categorySelected, setDialogDeleteState } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const intl = useIntl();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    stopPropagation(event);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: any) => {
    stopPropagation(event);
    setAnchorEl(null);
  };

  return (
    <>
      {!category.enable ? (
        <Chip
          variant="default"
          size="small"
          icon={<WarningIcon />}
          label={intl.formatMessage(messages.warningCategoryDisable)}
          color="secondary"
        />
      ) : null}

      <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>

      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={(e: any) => {
            stopPropagation(e);
            setDialogState({
              category: category,
              open: true,
              message: `${
                categorySelected != null
                  ? intl.formatMessage(messages.modifySubCategory)
                  : intl.formatMessage(messages.modifyCategory)
              } ${category.name}`,
              action: 'edit',
              typeForm: categorySelected != null ? 'subcategory' : 'category'
            });
            handleClose(e);
          }}
        >
          {intl.formatMessage(messages.actionEdit)}
        </MenuItem>
        <MenuItem
          onClick={(e: any) => {
            stopPropagation(e);
            setDialogDeleteState({
              category: category,
              open: true,
              typeCategory: categorySelected != null ? 'subcategory' : 'category'
            });
            handleClose(e);
          }}
        >
          {intl.formatMessage(messages.actionDelete)}
        </MenuItem>
      </Menu>
    </>
  );
};
export default ListOptions;
