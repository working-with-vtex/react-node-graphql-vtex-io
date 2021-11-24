import React, { useState } from 'react';
import { InputSearch, ModalDialog, Box, Spinner, Input } from 'vtex.styleguide';
import { UseColorApprovalManager, UseColorManager } from '../../../../../shared';
import ColorApprovalInformation from './ColorApprobalInformation';
import ColorItemSearch from './ColorItemSearch';
import styles from './index.css';

interface ModalAssign {
  colorApprovalManager: UseColorApprovalManager;
  colorManager: UseColorManager;
}

const ModalAssignColorApproval = ({
  colorManager: { colors, searchColors, setColors, loadingQuery },
  colorApprovalManager: {
    colorApprovalToAssign,
    colorsApprovalList,
    loadingAssignDialog,
    isModalAssignOpen,
    colorToUseInTheAssignation,
    setColorToUseInTheAssignation,
    handleConfirmationAssign,
    handleCancellationAssign
  }
}: ModalAssign) => {
  const [valueSearch, setValueSearch] = useState('');
  const color = colorApprovalToAssign ? colorsApprovalList[colorApprovalToAssign.index] : null;

  const handlerClose = () => {
    setValueSearch('');
    handleCancellationAssign();
    setColorToUseInTheAssignation(null);
  };

  const handlerConfirm = () => {
    handleConfirmationAssign();
  };

  return (
    <ModalDialog
      centered
      loading={loadingAssignDialog}
      confirmation={{
        onClick: handlerConfirm,
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
                searchColors();
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

          {loadingQuery ? (
            <div className="bg-muted-5 pa8 flex items-center justify-center">
              <div className="mb4">
                <Spinner />
              </div>
            </div>
          ) : null}

          {!loadingQuery && !colorToUseInTheAssignation && !colors.length && valueSearch != '' ? (
            <div className="bg-muted-5 pa8">
              <Box title={`No se ha encontrado un color con el nombre ${valueSearch}`}>
                <p className="mb4">
                  Verifique que el color realmente existe y de no ser así realice la creación del nuevo color
                </p>
              </Box>
            </div>
          ) : null}

          {color ? (
            <div className="flex flex-wrap">
              <div className="w-45 mr9">
                <h3 className="w-100">Color pendiente por asignación</h3>

                <div className={styles.containerInputs}>
                  <Input
                    size="small"
                    disabled={true}
                    label="Nombre de la especificación"
                    value={color.specificationName}
                  />
                </div>
                <div className={styles.containerInputs}>
                  <Input
                    size="small"
                    disabled={true}
                    label="Valor de la especificación"
                    value={color.specificationValue}
                  />
                </div>
                <div className={styles.containerInputs}>
                  <Input disabled={true} size="small" label="Nombre del vendedor" value={color.sellerId} />
                </div>
              </div>
            </div>
          ) : null}

          {colorApprovalToAssign && colorToUseInTheAssignation ? (
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
                {...{ colorsApprovalList, colorApprovalToAssign, colorToUseInTheAssignation }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </ModalDialog>
  );
};

export default ModalAssignColorApproval;
