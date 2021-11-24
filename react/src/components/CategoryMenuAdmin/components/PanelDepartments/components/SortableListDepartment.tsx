import { List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { ICategoryMenu, IDeleteDialogState, IDialogStateMenu } from '../../../../../shared';
import DragHandle from '../../SortableHandler';
import styles from '../index.css';
import ListOptions from './ListOptions';

interface Props {
  departments: ICategoryMenu[];
  onSortEnd: ({ oldIndex, newIndex }: { oldIndex: any; newIndex: any }) => void;
  setCurrentDepartment: (department: ICategoryMenu) => void;
  setDialogState: React.Dispatch<React.SetStateAction<IDialogStateMenu>>;
  departmentSelected: ICategoryMenu | null;
  setDialogDeleteState: React.Dispatch<React.SetStateAction<IDeleteDialogState>>;
}

const SortableItem = SortableElement(
  (props: {
    value: ICategoryMenu;
    setCurrentDepartment: (department: ICategoryMenu) => void;
    departmentSelected: ICategoryMenu | null;
    setDialogState: (value: React.SetStateAction<IDialogStateMenu>) => void;
    setDialogDeleteState: React.Dispatch<React.SetStateAction<IDeleteDialogState>>;
  }) => {
    const { value, departmentSelected, setDialogState, setDialogDeleteState } = props;

    return (
      <ListItem
        key={`listItem-${value.id}`}
        selected={departmentSelected ? value.id == departmentSelected.id : false}
        className={`${styles.departmentItem} ${
          departmentSelected && value.id == departmentSelected.id ? styles.departmentItemActive : ''
        }`}
      >
        <div className="mr5">
          <DragHandle />
        </div>

        <ListItemText primary={value.name} secondary={`category id: ${value.categoryId}`} />
        <ListItemSecondaryAction>
          <ListOptions {...{ setDialogState, category: value, setDialogDeleteState }} />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
);

const SortableList = SortableContainer(
  (props: {
    items: ICategoryMenu[];
    setCurrentDepartment: (department: ICategoryMenu) => void;
    departmentSelected: ICategoryMenu | null;
    setDialogState: (value: React.SetStateAction<IDialogStateMenu>) => void;
    setDialogDeleteState: React.Dispatch<React.SetStateAction<IDeleteDialogState>>;
  }) => {
    const { items, setCurrentDepartment, departmentSelected, setDialogState, setDialogDeleteState } = props;
    return (
      <List dense={true}>
        {items.map((item, index) => (
          <div key={`item-div-${item.id}`} onClick={() => setCurrentDepartment(item)}>
            <SortableItem
              {...{
                index,
                value: item,
                setCurrentDepartment,
                departmentSelected,
                setDialogState,
                setDialogDeleteState
              }}
            />
          </div>
        ))}
      </List>
    );
  }
);

const SortableListDepartment = (props: Props) => {
  const {
    departments,
    onSortEnd,
    setCurrentDepartment,
    setDialogDeleteState,
    setDialogState,
    departmentSelected
  } = props;

  if (departmentSelected == null) return null;

  return (
    <SortableList
      useDragHandle={true}
      {...{
        items: departments,
        onSortEnd,
        setCurrentDepartment,
        departmentSelected,
        setDialogState,
        setDialogDeleteState
      }}
    />
  );
};

export default SortableListDepartment;
