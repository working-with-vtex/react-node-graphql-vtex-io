import React, { useState } from 'react';
import { InputSearch, ModalDialog } from 'vtex.styleguide';
import { UseColorsTemplateInformationManager, UseColorManager } from '../../../../../../shared';
import ColorApprovalInformation from './ColorApprobalInformation';
import ColorItemSearch from './ColorItemSearch';
import styles from './index.css';

interface ModalAssign {
  colorsTemplateInformationManager: UseColorsTemplateInformationManager;
  colorManager: UseColorManager;
}

const ModalAssignColorToTemplateInfo = ({
  colorManager: { colors, searchColors, setColors },
  colorsTemplateInformationManager: {
    colorTemplateToAssign,
    templatesInformation,
    loadingAssignDialog,
    isModalAssignOpen,
    colorToUseInTheAssignation,
    setColorToUseInTheAssignation,
    handleConfirmationAssign,
    handleCancellationAssign
  }
}: ModalAssign) => {
  const [valueSearch, setValueSearch] = useState('');

  const handlerClose = () => {
    setValueSearch('');
    handleCancellationAssign();
    setColorToUseInTheAssignation(null);
  };

  return (
    <ModalDialog
      centered
      loading={loadingAssignDialog}
      confirmation={{
        onClick: handleConfirmationAssign,
        label: 'Asignar',
        isDangerous: true
      }}
      cancelation={{
        onClick: handlerClose,
        label: 'Cancelar'
      }}
      isOpen={isModalAssignOpen}
      onClose={handlerClose}
    >
      <div className={styles.assignContainer}>
        <p className="f3 f3-ns fw3">
          <b
            className={
              'pa3 br2 bg-action-secondary hover-bg-action-secondary active-bg-action-secondary c-on-action-secondary hover-c-on-action-secondary active-c-on-action-success dib mr3'
            }
          >
            1
          </b>{' '}
          Busca un color para realizar la asignación
        </p>

        <div className={styles.searchContainer}>
          <InputSearch
            placeholder="Buscar color..."
            value={valueSearch}
            size="small"
            onChange={(e: any) => {
              if (e.target.value != '') {
                searchColors(e.target.value);
              } else {
                setColors([]);
              }
              setValueSearch(e.target.value);
            }}
            onSubmit={(e: any) => {
              e.preventDefault();
              if (e.target.value != '') {
                searchColors(e.target.value);
              }
            }}
          />
          {colors.length ? (
            <div className={styles.colorListContainer}>
              {colors.map((item) => {
                return (
                  <ColorItemSearch
                    {...{
                      color: item,
                      setValueSearch,
                      setColors,
                      setColorToUseInTheAssignation
                    }}
                  />
                );
              })}
            </div>
          ) : null}

          {colorTemplateToAssign && colorToUseInTheAssignation ? (
            <div className={styles.colorApprovalInformation}>
              <p className="f3 f3-ns fw3">
                <b
                  className={
                    'pa3 br2 bg-action-secondary hover-bg-action-secondary active-bg-action-secondary c-on-action-secondary hover-c-on-action-secondary active-c-on-action-success dib mr3'
                  }
                >
                  2
                </b>{' '}
                Valida que la información de la nueva especificación sea correcta.
              </p>
              <ColorApprovalInformation
                {...{ templatesInformation, colorTemplateToAssign, colorToUseInTheAssignation }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </ModalDialog>
  );
};

export default ModalAssignColorToTemplateInfo;
