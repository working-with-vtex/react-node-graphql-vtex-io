import { Button } from '@material-ui/core';
import React from 'react';
import { useIntl } from 'react-intl';
import { EmptyState } from 'vtex.styleguide';
import { ICategoryMenu, IDialogStateMenu } from '../../../../../../src/shared';
import { messages } from '../../../../../messages';

interface Props {
  categorySelected: ICategoryMenu | null;
  setDialogState: (value: React.SetStateAction<IDialogStateMenu>) => void;
  departmentSelected: ICategoryMenu;
}

const EmptyResult = (props: Props) => {
  const { categorySelected, setDialogState, departmentSelected } = props;
  const intl = useIntl();

  return (
    <EmptyState
      title={
        categorySelected != null
          ? intl.formatMessage(messages.notFoundSubCTitle)
          : intl.formatMessage(messages.notFoundCatTitle)
      }
    >
      <p>
        {categorySelected != null
          ? intl.formatMessage(messages.notFoundSubCMessage)
          : intl.formatMessage(messages.notFoundCatCMessage)}
      </p>

      <div className="pt5">
        <Button
          onClick={() =>
            setDialogState({
              department: categorySelected != null ? categorySelected.id : departmentSelected.id,
              open: true,
              message:
                categorySelected != null
                  ? intl.formatMessage(messages.createSubCategory)
                  : intl.formatMessage(messages.createCategory),
              action: 'create',
              typeForm: categorySelected != null ? 'subcategory' : 'category'
            })
          }
          color="primary"
        >
          <span className="flex align-baseline">
            {categorySelected != null
              ? intl.formatMessage(messages.createSubCategory)
              : intl.formatMessage(messages.createCategory)}
          </span>
        </Button>
      </div>
    </EmptyState>
  );
};
export default EmptyResult;
