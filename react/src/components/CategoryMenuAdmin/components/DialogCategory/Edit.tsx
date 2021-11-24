import { FormControlLabel, Switch, TextareaAutosize } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { messages } from '../../../../messages';
import { ICategoryMenu } from '../../../../shared';
import styles from './index.css';

interface Props {
  handleClose: () => void;
  onFormCommit: (category: ICategoryMenu) => void;
  category: ICategoryMenu;
}

const Edit = (props: Props) => {
  const intl = useIntl();
  const { handleClose, onFormCommit, category } = props;
  const [form, setForm] = useState<ICategoryMenu>(category);

  const handleChange = (name: string) => (event: any) => {
    const value: any = { ...form };
    value[name] = event.target.value;
    setForm(value);
  };

  const handleChangeLowerCase = (name: string) => (event: any) => {
    const value: any = { ...form };
    value[name] = event.target.value.toLowerCase();
    setForm(value);
  };

  const handleChangeSwitch = (name: string) => (event: any) => {
    const value: any = { ...form };
    value[name] = event.target.checked;
    setForm(value);
  };

  return (
    <>
      <DialogContent>
        <div className="mb3 flex">
          <div className="mr3">
            <TextField
              className={styles.textField}
              id="name"
              label="Nombre"
              onChange={handleChange('name')}
              value={form.name}
              variant="filled"
            />
          </div>

          <TextField
            id="href"
            className={styles.textField}
            label="Url"
            onChange={handleChangeLowerCase('href')}
            value={form.href}
            variant="filled"
          />
        </div>
        <div className="mb3 flex">
          <div className="mr3">
            <TextField
              className={styles.textField}
              id="slug"
              label="Slug"
              onChange={handleChangeLowerCase('slug')}
              value={form.slug}
              variant="filled"
            />
          </div>
          <TextareaAutosize
            className={styles.textField}
            id="icon"
            placeholder="Icono"
            onChange={handleChange('icon')}
            rowsMax={7}
            value={form.icon ? form.icon : ''}
          />
        </div>

        <div className="mb3 flex">
          <div className="mr3">
            <TextField
              className={styles.textField}
              id="category-id"
              label="Id de la categoría"
              onChange={handleChange('categoryId')}
              value={form.categoryId}
              variant="filled"
            />
          </div>
          <FormControlLabel
            control={
              <Switch
                checked={form.enable ? form.enable : false}
                onChange={handleChangeSwitch('enable')}
                color="primary"
                name="enable"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Categoría disponible"
          />
        </div>

        <div className="mb3 flex">
          <div className="mr3">
            <TextField
              className={styles.textField}
              id="styles"
              label="Estilos personalizados"
              onChange={handleChange('styles')}
              value={form.styles}
              variant="filled"
            />
          </div>
          <FormControlLabel
            control={
              <Switch
                checked={form.showIconLeft ? form.showIconLeft : false}
                onChange={handleChangeSwitch('showIconLeft')}
                color="primary"
                name="showIconLeft"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Mostrar icono en la izquierda"
          />
        </div>

        <div className="mb3 flex">
          <div className="mr3">
            <TextField
              className={styles.textField}
              disabled={true}
              id="id-category"
              label="Identificador"
              onChange={handleChange('id')}
              value={form.id}
              variant="filled"
            />
          </div>
          {form.parent != null && (
            <TextField
              disabled={true}
              id="patern"
              className={styles.textField}
              label="Padre de la categoría"
              onChange={handleChange('parent')}
              value={form.parent}
              variant="filled"
            />
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {intl.formatMessage(messages.actionCancel)}
        </Button>
        <Button
          disabled={!form.name || !form.href || !form.slug}
          variant="contained"
          color="primary"
          onClick={() => onFormCommit(form)}
        >
          {intl.formatMessage(messages.actionSave)}
        </Button>
      </DialogActions>
    </>
  );
};
export default Edit;
