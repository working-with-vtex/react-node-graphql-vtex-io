import { List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { ICategoryMenu, IDeleteDialogState, IDialogStateMenu } from '../../../../../shared';
import DragHandle from '../../SortableHandler';
import styles from '../index.css';
import ListOptions from './ListOptions';

interface Props {
  filterCategories: ICategoryMenu[];
  categorySelected: ICategoryMenu | null;
  setCategorySelected: React.Dispatch<React.SetStateAction<ICategoryMenu | null>>;
  setDialogState: (value: React.SetStateAction<IDialogStateMenu>) => void;
  setDialogDeleteState: React.Dispatch<React.SetStateAction<IDeleteDialogState>>;
  onSortEnd: ({ oldIndex, newIndex }: { oldIndex: any; newIndex: any }) => void;
}

const SortableItem = SortableElement(
  (props: {
    value: ICategoryMenu;
    categorySelected: ICategoryMenu | null;
    setDialogState: (value: React.SetStateAction<IDialogStateMenu>) => void;
    setDialogDeleteState: React.Dispatch<React.SetStateAction<IDeleteDialogState>>;
  }) => {
    const { value, setDialogState, categorySelected, setDialogDeleteState } = props;
    return (
      <ListItem key={`listItem-${value.id}`} className={styles.listContainer}>
        <div className={`${styles.drawerButton} listItem-${value.id}`}>
          <DragHandle />
        </div>

        <ListItemText primary={value.name} secondary={`category id: ${value.categoryId}`} />
        <ListItemSecondaryAction>
          <ListOptions {...{ setDialogState, category: value, categorySelected, setDialogDeleteState }} />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
);

const SortableList = SortableContainer(
  (props: {
    items: ICategoryMenu[];
    categorySelected: ICategoryMenu | null;
    setCategorySelected: React.Dispatch<React.SetStateAction<ICategoryMenu | null>>;
    setDialogState: (value: React.SetStateAction<IDialogStateMenu>) => void;
    setDialogDeleteState: React.Dispatch<React.SetStateAction<IDeleteDialogState>>;
  }) => {
    const { categorySelected, setDialogState, items, setCategorySelected, setDialogDeleteState } = props;
    return (
      <List dense={true} className={styles.categoriesContent}>
        {items.map((value, index) => (
          <div
            key={`item-div-${value.id}`}
            onClick={categorySelected == null ? () => setCategorySelected(value) : () => {}}
          >
            <SortableItem
              {...{
                index,
                value,
                setDialogState,
                categorySelected,
                setDialogDeleteState
              }}
            />
          </div>
        ))}
      </List>
    );
  }
);

const SortableSubCategories = (props: Props) => {
  const {
    filterCategories,
    categorySelected,
    setCategorySelected,
    setDialogState,
    setDialogDeleteState,
    onSortEnd
  } = props;

  return (
    <>
      <SortableList
        useDragHandle={true}
        // axis={'xy'}
        {...{
          items: filterCategories,
          setDialogDeleteState,
          onSortEnd,
          categorySelected,
          setCategorySelected,
          setDialogState
        }}
      />
    </>
  );
};

export default SortableSubCategories;
