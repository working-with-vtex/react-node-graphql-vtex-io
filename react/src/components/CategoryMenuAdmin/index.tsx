import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from 'react-apollo';
import {
  ICategoryMenu,
  IDeleteDialogState,
  IDialogStateMenu,
  ShowToastParams,
  typeForm
} from '../../../src/shared';
import UpdateCategoryMenuMutation from '../../graphql/mutations/UpdateCategoryMenuMutation.graphql';
import getMenuQuery from '../../graphql/queries/GetCategoryMenuQuery.graphql';
import PageCategoryMenu from './Page';

interface Props {
  showToast: (params: ShowToastParams) => void;
}

const CategoryMenuAdmin = (props: Props) => {
  const { showToast } = props;
  // Get the data from getMenuQuery query
  const [getS3Categories, { loading, data, error }] = useLazyQuery(getMenuQuery);
  const [loadingQuery, setLoadingQuery] = useState(true);
  const [departments, setDepartments] = useState<ICategoryMenu[]>([]);
  const [categories, setCategories] = useState<ICategoryMenu[]>([]);
  const [subcategories, setSubcategories] = useState<ICategoryMenu[]>([]);
  const [departmentSelected, setDepartmentSelected] = useState<ICategoryMenu | null>(null);
  const [categorySelected, setCategorySelected] = useState<ICategoryMenu | null>(null);
  const [errorOnReadFile, setErrorOnReadFile] = useState(false);
  const [dialogState, setDialogState] = useState<IDialogStateMenu>({
    open: false,
    message: '',
    action: '',
    typeForm: ''
  });
  const [dialogDeleteState, setDialogDeleteState] = useState<IDeleteDialogState>({
    category: null,
    typeCategory: '',
    open: false
  });

  const getDepartments = (megaMenuLevel: ICategoryMenu[]): ICategoryMenu[] => {
    if (megaMenuLevel) {
      const deps = megaMenuLevel.filter((value: ICategoryMenu) => value.parent === null);
      return deps;
    }
    return [];
  };

  const getCategories = (megaMenuLevel: ICategoryMenu[]): ICategoryMenu[] => {
    const categories: ICategoryMenu[] = [];
    const deps = getDepartments(megaMenuLevel);
    if (megaMenuLevel) {
      deps.forEach((department) => {
        const departmentChild = megaMenuLevel.filter(
          (value: ICategoryMenu) => value.parent === department.id
        );
        categories.push(...departmentChild);
      });
    }
    return categories;
  };

  const getSubcategories = (megaMenuLevel: ICategoryMenu[]): ICategoryMenu[] => {
    const subcategories: ICategoryMenu[] = [];
    const cats = getCategories(megaMenuLevel);
    if (megaMenuLevel) {
      cats.forEach((category: ICategoryMenu) => {
        const categoriesChild = megaMenuLevel.filter((value: ICategoryMenu) => value.parent === category.id);
        subcategories.push(...categoriesChild);
      });
    }
    return subcategories;
  };

  const deleteCategories = (category: ICategoryMenu, typeCategory: typeForm) => {
    if (typeCategory == 'department') {
      const dep = _.map(departments, _.clone);
      _.remove(dep, function (n) {
        return n.id == category.id;
      });
      const sub = _.map(subcategories, _.clone);
      const cat = _.map(categories, _.clone);
      _.remove(cat, function (nCat) {
        // Remove all subcategories from the category selected for delete
        if (nCat.parent == category.id) {
          _.remove(sub, function (nSub) {
            return nSub.parent == nCat.id;
          });
        }
        return nCat.parent == category.id;
      });

      setCategories(cat);
      setSubcategories(sub);
      setDepartments(dep);
      setDepartmentSelected(dep[0]);
    } else if (typeCategory == 'category') {
      const cat = _.map(categories, _.clone);
      _.remove(cat, function (n) {
        return n.id == category.id;
      });
      const sub = _.map(subcategories, _.clone);
      _.remove(sub, function (n) {
        return n.parent == category.id;
      });
      setCategories(cat);
      setSubcategories(sub);
    } else if (typeCategory == 'subcategory') {
      const sub = _.map(subcategories, _.clone);
      _.remove(sub, function (n) {
        return n.id == category.id;
      });
      setSubcategories(sub);
    }
  };

  const setCurrentDepartment = (department: ICategoryMenu | null) => {
    setDepartmentSelected(department);
    setCategorySelected(null);
  };

  const onAddCategories = (category: ICategoryMenu, department: number | null, typeForm: typeForm) => {
    const categoriesToUse =
      typeForm == 'department' ? departments : typeForm == 'subcategory' ? subcategories : categories;
    const cats = Object.assign([], categoriesToUse);
    const items = [...departments, ...categories, ...subcategories].sort((a, b) => a.id - b.id);

    if (!items.length) {
      category.id = 1;
      category.parent = department;
    } else {
      const lastCategory = Object.assign({}, items[items.length - 1]);
      category.id = lastCategory.id + 1;
      category.parent = department;
    }

    if (typeForm == 'department') {
      cats.push(category);
      setDepartments(cats);
    } else if (typeForm == 'category') {
      cats.push(category);
      setCategories(cats);
    } else if (typeForm == 'subcategory') {
      cats.push(category);
      setSubcategories(cats);
    }
  };

  const onUpdateCategories = (department: ICategoryMenu, typeForm: typeForm) => {
    if (typeForm == 'department') {
      var index = _.findIndex(departments, { id: department.id });
      // Replace item at index using native splice
      departments.splice(index, 1, department);
      setDepartments(Object.assign([], departments));
    } else if (typeForm == 'category') {
      var index = _.findIndex(categories, { id: department.id });
      // Replace item at index using native splice
      categories.splice(index, 1, department);
      setCategories(Object.assign([], categories));
    } else if (typeForm == 'subcategory') {
      var index = _.findIndex(subcategories, { id: department.id });
      // Replace item at index using native splice
      subcategories.splice(index, 1, department);
      setSubcategories(Object.assign([], subcategories));
    }
  };

  useEffect(() => {
    if (error) {
      setDepartments([]);
      setLoadingQuery(false);
      setErrorOnReadFile(true);
    }
    if (!loading) {
      if (data && data.getCategoryMenu && data.getCategoryMenu.data.categories) {
        setErrorOnReadFile(false);
        setLoadingQuery(false);
        const megaMenu = data.getCategoryMenu.data.categories;
        const currentDepartments = getDepartments(megaMenu);
        setDepartments(currentDepartments);
        setCategories(getCategories(megaMenu));
        setSubcategories(getSubcategories(megaMenu));
        setDepartmentSelected(currentDepartments[0]);
      } else {
        setLoadingQuery(false);
      }
    }
  }, [data]);

  useEffect(() => {
    getS3Categories();
  }, []);

  useEffect(() => {
    console.debug(departments);
    if (departments.length === 1) {
      setDepartmentSelected(departments[0]);
    }
  }, [departments]);

  // Action to UpdateCategoryMenuMutation
  const [changeState, mutationState] = useMutation(UpdateCategoryMenuMutation);
  useEffect(() => {
    if (!mutationState.loading) {
      if (mutationState.data) {
        const { message } = mutationState.data.updateCategoryMenu;
        showToast({ message, duration: 3000 });
      }
    }
  }, [mutationState]);

  const saveChanges = () => {
    const changeStateParam = [...departments, ...categories, ...subcategories];
    changeState({ variables: { data: changeStateParam } });
  };

  return (
    <>
      <PageCategoryMenu
        {...{
          setDialogState,
          dialogState,
          categorySelected,
          deleteCategories,
          departmentSelected,
          errorOnReadFile,
          categories,
          setDepartments,
          getS3Categories,
          subcategories,
          departments,
          loading: loadingQuery,
          setCategories,
          setCategorySelected,
          setSubcategories,
          onAddCategories,
          onUpdateCategories,
          saveChanges,
          setCurrentDepartment,
          setDialogDeleteState,
          dialogDeleteState,
          showToast
        }}
      />
    </>
  );
};

export default CategoryMenuAdmin;
