import React, { useState } from 'react';
import { Card, Divider, PageBlock, Collapsible } from 'vtex.styleguide';

const Information = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PageBlock>
      <Collapsible
        header={
          <span className="c-action-primary hover-c-action-primary fw5">
            Ten presente los siguientes puntos para el manejo de una plantilla.
          </span>
        }
        onClick={(e: any) => setIsOpen(e.target.isOpen)}
        isOpen={isOpen}
      >
        <div className="mb3">
          <Card>
            <h3 className="mt0 mb6">¿Cuando se ejecuta la tarea para obtener las especificaciones?</h3>
            <p className="f5 gray ma0">
              Al momento de crear una plantilla esta no empieza a ejecutar la
              consulta de especificaciones, debes de iniciar la ejecución de esta tarea cambiando el estado de la
              plantilla con la opción <b>"Acciones/Ejecutar"</b>
            </p>
            <div className="mv6">
              <Divider orientation="horizontal" />
            </div>
            <h3 className="mt0 mb6">¿Como puedo volver a generar las especificaciones?</h3>
            <p className="f5 gray ma0">
              Para volver a realizar la consulta de las especificaciones primero
              debes eliminar todos los registros generados por dicha plantilla, esta acción la puedes realizar con
              la opción <b>"Acciones/Eliminar registros generados"</b>{' '}
               disponible en la tabla de registros, luego de realizar la eliminación
              podrás volver a realizar la ejecución de la tarea que consulta las especificaciones.
              <br />
              <b className="mt5 flex">
                Esta acción puede ser muy útil para reutilizar plantillas y no tener que crear una nueva
                siempre.
              </b>
            </p>

            <div className="mv6">
              <Divider orientation="horizontal" />
            </div>
            <h3 className="mt0 mb6">
              ¿Como se que productos fallaron en la obtención de las especificaciones?
            </h3>
            <p className="f5 gray ma0">
               En la opción <b>"Productos que no pudieron ser procesados"</b>
               encontraras el total de productos que
              presentaron errores al ser consultados y sus respectivos id
            </p>

            <div className="mv6">
              <Divider orientation="horizontal" />
            </div>
            <h3 className="mt0 mb6">¿Cuando puedo descargar la información de la plantilla?</h3>
            <p className="f5 gray ma0">
               Solo puedes descargar la plantilla cuando esta no posee registros duplicados y todos poseen un
              nombre y valor asignado, puedes asignar el nombre y valor empleado la opción que hay en la
              columna <b>"Asignar"</b>
            </p>
          </Card>
        </div>
      </Collapsible>
    </PageBlock>
  );
};

export default Information;
