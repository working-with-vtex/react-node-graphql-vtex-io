import React from 'react';
import { useIntl } from 'react-intl';
import { Box, Button, EmptyState, Spinner } from 'vtex.styleguide';
import { messages } from '../../../src/messages';
import {
  ICategoryMenu,
  IDeleteDialogState,
  IDialogStateMenu,
  ShowToastParams,
  typeForm
} from '../../../src/shared';
import { Paper } from '@material-ui/core';
import DeleteCategoryDialog from './components/DeleteCategoryDialog';
import DialogCreateCategory from './components/DialogCategory';
import PanelDepartments from './components/PanelDepartments';
import PanelSubCategories from './components/PanelSubCategories';

interface Props {
  errorOnReadFile: boolean;
  departmentSelected: ICategoryMenu | null;
  categorySelected: ICategoryMenu | null;
  dialogState: IDialogStateMenu;
  dialogDeleteState: IDeleteDialogState;
  departments: ICategoryMenu[];
  categories: ICategoryMenu[];
  subcategories: ICategoryMenu[];
  loading: boolean;
  showToast: (params: ShowToastParams) => void;
  saveChanges: () => void;
  getS3Categories: (options?: any) => void;
  onUpdateCategories: (department: ICategoryMenu, typeForm: typeForm) => void;
  onAddCategories: (category: ICategoryMenu, department: number | null, typeForm: typeForm) => void;
  setCurrentDepartment: (department: ICategoryMenu | null) => void;
  deleteCategories: (category: ICategoryMenu, typeCategory: typeForm) => void;
  setDialogState: React.Dispatch<React.SetStateAction<IDialogStateMenu>>;
  setDialogDeleteState: React.Dispatch<React.SetStateAction<IDeleteDialogState>>;
  setDepartments: React.Dispatch<React.SetStateAction<ICategoryMenu[]>>;
  setCategorySelected: React.Dispatch<React.SetStateAction<ICategoryMenu | null>>;
  setCategories: React.Dispatch<React.SetStateAction<ICategoryMenu[]>>;
  setSubcategories: React.Dispatch<React.SetStateAction<ICategoryMenu[]>>;
}

const PageCategoryMenu = (props: Props) => {
  const {
    loading,
    departmentSelected,
    categorySelected,
    dialogState,
    dialogDeleteState,
    categories,
    departments,
    subcategories,
    errorOnReadFile,
    showToast,
    saveChanges,
    onUpdateCategories,
    setDialogDeleteState,
    setCurrentDepartment,
    onAddCategories,
    deleteCategories,
    setDialogState,
    getS3Categories,
    setDepartments,
    setCategorySelected,
    setCategories,
    setSubcategories
  } = props;
  const intl = useIntl();

  if (loading) {
    return (
      <Box>
        <div style={{ margin: '0 auto', width: '20px', display: 'block' }}>
          <Spinner />
        </div>
      </Box>
    );
  }

  if (errorOnReadFile && !loading) {
    return (
      <EmptyState title={intl.formatMessage(messages.errorTitle)}>
        <p>{intl.formatMessage(messages.errorCategoriesRead)}</p>

        <div className="pt5">
          <Button variation="secondary" size="small" onClick={() => getS3Categories()}>
            <span className="flex align-baseline">{intl.formatMessage(messages.getCategories)}</span>
          </Button>
        </div>
      </EmptyState>
    );
  }

  return (
    <div className="pa5">
      <DeleteCategoryDialog {...{ information: dialogDeleteState, setDialogDeleteState, deleteCategories }} />
      <DialogCreateCategory {...{ ...dialogState, setDialogState, onAddCategories, onUpdateCategories }} />
      <Paper elevation={3}>
        <div className="flex">
          <PanelDepartments
            {...{
              departments,
              categories,
              subcategories,
              setCurrentDepartment,
              setDepartments,
              departmentSelected,
              setDialogState,
              setDialogDeleteState,
              showToast,
              saveChanges
            }}
          />
          <PanelSubCategories
            {...{
              departments,
              categories,
              subcategories,
              departmentSelected,
              categorySelected,
              setCategorySelected,
              setCurrentDepartment,
              setDialogState,
              setCategories,
              setSubcategories,
              setDialogDeleteState
            }}
          />
        </div>
      </Paper>
    </div>
  );
};

export default PageCategoryMenu;
