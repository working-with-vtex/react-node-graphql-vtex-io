import { IDialogState } from '.';

export interface ICategoryMenu {
  id: number;
  name: string;
  href: string;
  slug: string;
  icon: string | null;
  parent: number | null;
  styles: string | null;
  showIconLeft: boolean | null;
  showIconRight: boolean | null;
  categoryId: string | null;
  enable: boolean | null;
}

export interface IDialogStateMenu extends IDialogState {
  category?: ICategoryMenu;
  department?: number | null;
  typeForm: typeForm;
}

export interface IDeleteDialogState {
  typeCategory: typeForm;
  category: ICategoryMenu | null;
  open: boolean;
}

export type typeForm = 'department' | 'subcategory' | 'category' | '';
