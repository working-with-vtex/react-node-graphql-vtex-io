import arrayMove from 'array-move';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { EmptyState } from 'vtex.styleguide';
import { ICategoryMenu, IDeleteDialogState, IDialogStateMenu } from '../../../../../src/shared';
import { messages } from '../../../../messages';
import EmptyResult from './components/EmptyResult';
import HeaderSubCategories from './components/HeaderSubCategories';
import SortableSubCategories from './components/SortableSubCategories';

interface Props {
  departments: ICategoryMenu[];
  categories: ICategoryMenu[];
  subcategories: ICategoryMenu[];
  departmentSelected: ICategoryMenu | null;
  setCategorySelected: React.Dispatch<React.SetStateAction<ICategoryMenu | null>>;
  setCurrentDepartment: (department: ICategoryMenu | null) => void;
  categorySelected: ICategoryMenu | null;
  setDialogState: (value: React.SetStateAction<IDialogStateMenu>) => void;
  setCategories: React.Dispatch<React.SetStateAction<ICategoryMenu[]>>;
  setSubcategories: React.Dispatch<React.SetStateAction<ICategoryMenu[]>>;
  setDialogDeleteState: React.Dispatch<React.SetStateAction<IDeleteDialogState>>;
}

const PanelSubCategories = (props: Props) => {
  const {
    categories,
    setCurrentDepartment,
    subcategories,
    departments,
    departmentSelected,
    setCategorySelected,
    categorySelected,
    setDialogState,
    setSubcategories,
    setCategories,
    setDialogDeleteState
  } = props;
  const intl = useIntl();

  const [filterCategories, setFilterCategories] = useState<ICategoryMenu[]>([]);

  useEffect(() => {
    if (departmentSelected) {
      if (departments.length && categorySelected == null) {
        setFilterCategories(
          categories.filter((item) => {
            if (item.parent != departmentSelected.id) return false;
            return true;
          })
        );
      }
      if (departments.length && categorySelected != null) {
        setFilterCategories(
          subcategories.filter((item) => {
            if (item.parent != categorySelected.id) return false;
            return true;
          })
        );
      }
    }
  }, [departmentSelected, departments, categorySelected, subcategories, categories]);

  // Remove the elements from the array.
  const removeElements = (original: ICategoryMenu[], elements: ICategoryMenu[]): ICategoryMenu[] => {
    const copyOriginal = _.clone(original);
    elements.map((item) => {
      _.remove(copyOriginal, function (element) {
        return element.id == item.id;
      });
    });
    return copyOriginal;
  };

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: any; newIndex: any }) => {
    const sortedCategories = arrayMove(filterCategories, oldIndex, newIndex);
    setFilterCategories(sortedCategories);

    // Save the sorted list
    if (categorySelected == null) {
      const newCategories = [...removeElements(categories, sortedCategories), ...sortedCategories];
      setCategories(newCategories);
    } else if (categorySelected != null) {
      const newCategories = [...removeElements(subcategories, sortedCategories), ...sortedCategories];
      setSubcategories(newCategories);
    }
  };

  if (!departments.length || departmentSelected == null)
    return (
      <div className="w-70 pl3">
        <EmptyState title={intl.formatMessage(messages.departmentNotFound)}>
          <p>{intl.formatMessage(messages.departmentNotFoundMessage)}</p>
        </EmptyState>
      </div>
    );

  return (
    <div className="w-70 pl3">
      <HeaderSubCategories
        {...{ setDialogState, departmentSelected, categorySelected, setCurrentDepartment }}
      />

      {filterCategories.length <= 0 && (
        <EmptyResult {...{ departmentSelected, setDialogState, categorySelected }} />
      )}

      {filterCategories.length > 0 ? (
        <SortableSubCategories
          {...{
            onSortEnd,
            categorySelected,
            filterCategories,
            setCategorySelected,
            setDialogDeleteState,
            setDialogState
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default PanelSubCategories;
