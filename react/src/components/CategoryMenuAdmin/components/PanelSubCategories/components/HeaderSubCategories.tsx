import { AppBar, Breadcrumbs, Chip, IconButton, Toolbar, Tooltip, Typography } from '@material-ui/core';
import { emphasize, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import { useIntl } from 'react-intl';
import { ICategoryMenu, IDialogStateMenu } from '../../../../../../src/shared';
import { messages } from '../../../../../messages';
import styles from '../index.css';

interface Props {
  categorySelected: ICategoryMenu | null;
  departmentSelected: ICategoryMenu | null;
  setCurrentDepartment: (department: ICategoryMenu | null) => void;
  setDialogState: (value: React.SetStateAction<IDialogStateMenu>) => void;
}

const StyledBreadcrumb = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.grey[300]
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12)
    }
  }
}))(Chip) as typeof Chip;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  toolbar: {
    minHeight: 128,
    alignItems: 'flex-start',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2)
  },
  options: {
    marginTop: '30px'
  },
  breadcrumb: {
    marginTop: '20px'
  },
  title: {
    flexGrow: 1,
    marginTop: '10px',
    marginLeft: theme.spacing(2)
  }
}));

const HeaderSubCategories = (props: Props) => {
  const { categorySelected, departmentSelected, setCurrentDepartment, setDialogState } = props;
  const classes = useStyles();
  const intl = useIntl();

  return (
    <AppBar position="static" color="inherit">
      <Toolbar className={classes.toolbar}>
        <div className={classes.title}>
          <Typography variant="h5" noWrap>
            {categorySelected != null
              ? intl.formatMessage(messages.subCategory)
              : intl.formatMessage(messages.category)}
          </Typography>
          <Breadcrumbs className={classes.breadcrumb} aria-label="breadcrumb">
            <StyledBreadcrumb
              component="a"
              label={departmentSelected ? departmentSelected.name : ''}
              className={`${styles.categoryNavigation}`}
              onClick={categorySelected != null ? () => setCurrentDepartment(departmentSelected) : () => {}}
            />
            {categorySelected != null ? (
              <StyledBreadcrumb
                component="a"
                label={categorySelected.name}
                className={`${styles.categoryNavigation}`}
              />
            ) : null}
          </Breadcrumbs>
        </div>
        <div className={classes.options}>
          <Tooltip
            title={
              categorySelected != null
                ? intl.formatMessage(messages.createSubCategory)
                : intl.formatMessage(messages.createCategory)
            }
            aria-label="create"
          >
            <IconButton
              onClick={() =>
                setDialogState({
                  department:
                    categorySelected != null
                      ? categorySelected.id
                      : departmentSelected
                      ? departmentSelected.id
                      : null,
                  open: true,
                  message:
                    categorySelected != null
                      ? intl.formatMessage(messages.createSubCategory)
                      : intl.formatMessage(messages.createCategory),
                  action: 'create',
                  typeForm: categorySelected != null ? 'subcategory' : 'category'
                })
              }
              aria-label="share"
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
    </AppBar>
  );
};
export default HeaderSubCategories;
