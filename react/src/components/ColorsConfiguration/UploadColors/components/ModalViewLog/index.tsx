import React from 'react';
import { Modal, Card } from 'vtex.styleguide';
import { UseUploadColorsManager } from '../../../../../shared';
import styles from './index.css';

interface Props {
  uploadColorsManager: UseUploadColorsManager;
}

const ModalViewLog = (props: Props) => {
  const {
    uploadColorsManager: { isModalOpen, setIsModalOpen, listLogs }
  } = props;

  const handlerClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal centered isOpen={isModalOpen} onClose={handlerClose}>
      <div className={styles.modalContainerLogs}>
        <p className="f3 f3-ns fw3 gray">Lista de logs obtenidos</p>
        <div>
          {listLogs.map((item, index) => {
            if (item && item.color) {
              return (
                <div key={`item-log-${index}`} className={`${styles.cartLogItem}`}>
                  <Card>
                    <p className={styles.catTitle}>
                      Elemento con el nombre <b>{item.color.colorName}</b> en la posición{' '}
                      <b>{item.colorPosition + 1}</b>
                    </p>
                    <p className={styles.catMessage}>
                      <b>Mensaje del problema presentado:</b> {item.message}
                    </p>
                  </Card>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </Modal>
  );
};

export default ModalViewLog;
