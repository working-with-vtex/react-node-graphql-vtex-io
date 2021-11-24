import arrayMove from 'array-move';
import React from 'react';
import { useIntl } from 'react-intl';
import { Button, EmptyState } from 'vtex.styleguide';
import { messages } from '../../../../messages';
import { ICategoryMenu, IDeleteDialogState, IDialogStateMenu, ShowToastParams } from '../../../../shared';
import HeaderDepartments from './components/HeaderDepartments';
import SortableListDepartment from './components/SortableListDepartment';
import styles from './index.css';

interface Props {
  departments: ICategoryMenu[];
  categories: ICategoryMenu[];
  subcategories: ICategoryMenu[];
  departmentSelected: ICategoryMenu | null;
  showToast: (params: ShowToastParams) => void;
  setCurrentDepartment: (department: ICategoryMenu) => void;
  setDepartments: React.Dispatch<React.SetStateAction<ICategoryMenu[]>>;
  setDialogState: React.Dispatch<React.SetStateAction<IDialogStateMenu>>;
  setDialogDeleteState: React.Dispatch<React.SetStateAction<IDeleteDialogState>>;
  saveChanges: () => void;
}

const PanelDepartments = (props: Props) => {
  const {
    departments,
    setCurrentDepartment,
    setDepartments,
    departmentSelected,
    setDialogState,
    categories,
    subcategories,
    setDialogDeleteState,
    saveChanges,
    showToast
  } = props;
  const intl = useIntl();

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: any; newIndex: any }) => {
    setDepartments(arrayMove(departments, oldIndex, newIndex));
  };

  return (
    <div className={styles.panelCategories}>
      <HeaderDepartments
        {...{ categories, subcategories, showToast, saveChanges, setDialogState, departments }}
      />
      {departments.length ? (
        <div className={styles.panelCategoriesList}>
          <SortableListDepartment
            {...{
              departmentSelected,
              setDialogState,
              setDialogDeleteState,
              setCurrentDepartment,
              departments,
              onSortEnd
            }}
          />
        </div>
      ) : (
        <EmptyState title={intl.formatMessage(messages.notHaveDepartments)}>
          <div className="pt5">
            <Button
              variation="secondary"
              size="small"
              onClick={() =>
                setDialogState({
                  department: null,
                  open: true,
                  message: intl.formatMessage(messages.createDepartment),
                  action: 'create',
                  typeForm: 'department'
                })
              }
            >
              <span className="flex align-baseline">{intl.formatMessage(messages.createDepartment)}</span>
            </Button>
          </div>
        </EmptyState>
      )}
    </div>
  );
};

export default PanelDepartments;
