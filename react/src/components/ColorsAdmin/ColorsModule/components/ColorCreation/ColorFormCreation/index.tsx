import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  InputButton,
  PageBlock,
  PageHeader,
  SelectableCard,
  Tag,
  Toggle,
  Textarea
} from 'vtex.styleguide';
import { config, IColorCreation, TypeColor, UseColorManager } from '../../../../../../shared';
import styles from './index.css';

let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

type OptionToAdd = 'variations' | 'sellers';

const emptyColor: IColorCreation = {
  creationDate: `${year}-${month}-${day}`,
  colorName: '',
  sellers: '',
  type: 'color',
  value: '',
  isLight: false,
  variations: ''
};

const ColorFormCreation = (props: { colorManager: UseColorManager }) => {
  const {
    colorManager: { runtime, handlerCreateColor }
  } = props;
  const [tempColor, setTempColor] = useState<IColorCreation>(emptyColor);
  const [selectedCard, setSelectedCard] = useState('color');
  const [haveChanges, setHaveChanges] = useState(false);
  const [variationList, setVariationList] = useState<string[]>([]);
  const [sellerList, setSellerList] = useState<string[]>([]);
  const [newVariation, setNewVariation] = useState('');
  const [newSeller, setNewSeller] = useState('');
  const [errorKeyVariation, setErrorKeyVariation] = useState('');
  const [errorKeySeller, setErrorKeySeller] = useState('');

  useEffect(() => {
    if (tempColor.colorName !== '' && tempColor.value !== '') {
      setHaveChanges(!_.isEqual(emptyColor, tempColor));
    } else {
      setHaveChanges(false);
    }

    if (tempColor) {
      setVariationList(getListFromString(tempColor.variations));
      setSellerList(getListFromString(tempColor.sellers));
    }
  }, [tempColor]);

  const getListFromString = (text: string) => {
    return text.split(',');
  };

  const isSelected = (opt: string) => {
    return opt === selectedCard;
  };

  const handlerSelectedCard = (opt: TypeColor) => {
    setSelectedCard(opt);
    if (tempColor) {
      setTempColor({ ...tempColor, type: opt });
    }
  };

  const handlerSaveColor = () => {
    if (tempColor) {
      handlerCreateColor(tempColor);
    }
  };

  const handlerClear = () => {
    setTempColor({ ...emptyColor, value: '' });
    setNewSeller('');
    setNewVariation('');
  };

  const deleteItem = (index: number, key: OptionToAdd) => {
    if (key == 'sellers') {
      sellerList.splice(index, 1);
      updateKeyInTemColor(key, sellerList);
      setErrorKeySeller('');
    }

    if (key == 'variations') {
      console.debug(variationList);
      console.debug(variationList.length);
      variationList.splice(index, 1);
      updateKeyInTemColor(key, variationList);
      setErrorKeyVariation('');
    }
  };

  const updateKeyInTemColor = (key: OptionToAdd, list: string[]) => {
    let text = '';
    list.map((item, index) => {
      text += `${index != 0 ? ',' : ''}${item}`;
    });
    if (tempColor) {
      setTempColor({ ...tempColor, [key]: text });
    }
  };

  const addNewItemVariation = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setErrorKeyVariation('');

    if (tempColor && newVariation != '') {
      setTempColor({
        ...tempColor,
        variations: (tempColor.variations += `${tempColor.variations == '' ? '' : ','}${newVariation}`)
      });
      setNewVariation('');
    }
  };

  const addNewItemSeller = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setErrorKeySeller('');
    if (tempColor && newSeller != '') {
      console.debug(tempColor);

      setTempColor({
        ...tempColor,
        sellers: (tempColor.sellers += `${tempColor.sellers == '' ? '' : ','}${newSeller}`)
      });
      console.debug(tempColor);

      setNewSeller('');
    }
  };

  return (
    <div className="pa5">
      <PageHeader
        title={`${tempColor.colorName == '' ? 'Ingresa un nombre' : tempColor.colorName}`}
        linkLabel="Volver"
        subtitle="Creación de un nuevo color"
        onLinkClick={(_e: any) => {
          runtime.navigate({
            page: config.colorListRoute
          });
        }}
      >
        <span className="mr4">
          <Button variation="secondary" disabled={!haveChanges} onClick={() => handlerClear()}>
            Limpiar
          </Button>
        </span>

        <Button variation="primary" disabled={!haveChanges} onClick={() => handlerSaveColor()}>
          Crear
        </Button>
      </PageHeader>

      <PageBlock variation="full">
        <div className="flex items-center justify-between">
          <div className="flex flex-column">
            <div className="mb4">
              <h4 className="t-heading-6 mt0"> Tipo de color </h4>

              <div className="flex justify-start">
                <SelectableCard
                  hasGroupRight
                  noPadding
                  selected={isSelected('color')}
                  onClick={() => handlerSelectedCard('color')}
                >
                  <div className="pa7">
                    <div className="f5 tc">Color</div>
                  </div>
                </SelectableCard>
                <SelectableCard
                  hasGroupRight
                  hasGroupLeft
                  noPadding
                  selected={isSelected('gradient')}
                  onClick={() => handlerSelectedCard('gradient')}
                >
                  <div className="pa7">
                    <div className="f5 tc">Gradiente de color</div>
                  </div>
                </SelectableCard>
                <SelectableCard
                  hasGroupRight
                  hasGroupLeft
                  noPadding
                  selected={isSelected('image')}
                  onClick={() => handlerSelectedCard('image')}
                >
                  <div className="pa7">
                    <div className="f5 tc">Imagen/Textura</div>
                  </div>
                </SelectableCard>
              </div>
            </div>

            <div className="flex flex-column">
              <div className="mb5">
                <Input
                  label="Nombre"
                  maxLength={40}
                  errorMessage={!tempColor.colorName ? '¡Campo requerido!' : ''}
                  onChange={(e: any) => setTempColor({ ...tempColor, colorName: e.target.value })}
                  value={tempColor.colorName}
                />
              </div>

              <div className="mb5">
                <Textarea
                  value={tempColor.value}
                  errorMessage={!tempColor.value ? '¡Campo requerido!' : ''}
                  onChange={(e: any) => setTempColor({ ...tempColor, value: e.target.value })}
                  label="Valor"
                ></Textarea>
              </div>
            </div>
          </div>
          {tempColor.value !== '' ? (
            <div>
              <PageBlock variation="full">
                {tempColor.type != 'image' && (
                  <div className={`${styles.imageCardPresentation}`} style={{ background: tempColor.value }}>
                    <div className={`${styles.checkIcon} ${tempColor.isLight ? styles.isLight : ''}`}></div>
                  </div>
                )}
                {tempColor.type === 'image' && (
                  <div className={`${styles.imageCardPresentation}`}>
                    <div className={`${styles.checkIcon} ${tempColor.isLight ? styles.isLight : ''}`}></div>
                    <img src={tempColor.value} alt={tempColor.colorName} />
                  </div>
                )}
              </PageBlock>
              <div className="flex items-center justify-center">
                <Toggle
                  label={tempColor.isLight ? 'Claro' : 'Oscuro'}
                  size="large"
                  checked={tempColor.isLight}
                  onChange={(_e: any) => setTempColor({ ...tempColor, isLight: !tempColor.isLight })}
                  helpText="Defina el color del estado check"
                />
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </PageBlock>

      <PageBlock variation="half">
        <div>
          <h6 className="t-heading-6 mt4 mb5">Variaciones</h6>

          <div className="flex flex-wrap">
            {variationList.map((item, index) => {
              if (item == '') return null;

              return (
                <span className="mr4 pt4 db" key={`tag-element${index}`}>
                  <Tag onClick={() => deleteItem(index, 'variations')}>{item}</Tag>
                </span>
              );
            })}
          </div>

          <form onSubmit={addNewItemVariation} className="mt5">
            <InputButton
              placeholder="Agregar una variación"
              size="regular"
              button="Agregar"
              onChange={(e: any) => setNewVariation(e.target.value)}
              value={newVariation}
              errorMessage={errorKeyVariation ? errorKeyVariation : ''}
            />
          </form>
        </div>
        <div>
          <h6 className="t-heading-6 mt4 mb5">Sellers</h6>
          <div className="flex flex-wrap">
            {sellerList.map((item, index) => {
              if (item == '') return null;

              return (
                <span className="mr4 pt4 db" key={`tag-element${index}`}>
                  <Tag onClick={() => deleteItem(index, 'sellers')}>{item}</Tag>
                </span>
              );
            })}
          </div>

          <form onSubmit={addNewItemSeller} className="mt5">
            <InputButton
              placeholder="Agregar un nuevo seller"
              size="regular"
              button="Agregar"
              onChange={(e: any) => setNewSeller(e.target.value)}
              value={newSeller}
              errorMessage={errorKeySeller ? errorKeySeller : ''}
            />
          </form>
        </div>
      </PageBlock>
    </div>
  );
};

export default ColorFormCreation;
