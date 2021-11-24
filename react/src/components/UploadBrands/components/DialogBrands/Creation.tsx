import { FormControlLabel, Switch } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { messages } from '../../../../messages';
import { BrandsItemType } from '../../../../shared';
import styles from './index.css';

interface Props {
  handleClose: () => void;
  onFormCommit: (mark: BrandsItemType) => void;
}

const Creation = (props: Props) => {
  const intl = useIntl();
  const { handleClose, onFormCommit } = props;
  const [form, setForm] = useState<BrandsItemType>({
    name: '',
    keywords: '',
    text: '',
    siteTitle: '',
    menuHome: false,
    active: false,
    id: ''
  });

  const handleChange = (name: string) => (event: any) => {
    const value: any = { ...form };
    value[name] = event.target.value;
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
              label="Name"
              onChange={handleChange('name')}
              value={form.name}
              variant="filled"
            />
          </div>

          <TextField
            id="keywords"
            className={styles.textField}
            label="Keywords"
            onChange={handleChange('keywords')}
            value={form.keywords}
            variant="filled"
          />
        </div>
        <div className="mb3 flex">
          <div className="mr3">
            <TextField
              className={styles.textField}
              id="siteTitle"
              label="SiteTitle"
              onChange={handleChange('siteTitle')}
              value={form.siteTitle}
              variant="filled"
            />
          </div>
          <TextField
            id="text"
            className={styles.textField}
            label="Text"
            onChange={handleChange('text')}
            value={form.text}
            variant="filled"
          />
        </div>

        <div className="mb3 flex">
          <div className="mr3">
            <FormControlLabel
              control={
                <Switch
                  checked={form.menuHome}
                  onChange={handleChangeSwitch('menuHome')}
                  color="primary"
                  name="menuHome"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="MenuHome"
            />
          </div>
          <FormControlLabel
            control={
              <Switch
                checked={form.active}
                onChange={handleChangeSwitch('active')}
                color="primary"
                name="active"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Active"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {intl.formatMessage(messages.actionCancel)}
        </Button>
        <Button
          disabled={!form.name || !form.siteTitle || !form.keywords}
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
export default Creation;
