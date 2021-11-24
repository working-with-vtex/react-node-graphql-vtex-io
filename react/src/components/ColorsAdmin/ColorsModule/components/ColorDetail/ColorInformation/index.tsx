import React, { useEffect, useState } from 'react';
import {
  PageHeader,
  PageBlock,
  Input,
  SelectableCard,
  Spinner,
  EmptyState,
  Tag,
  Textarea,
  Button,
  InputButton,
  Toggle
} from 'vtex.styleguide';
import { UseColorManager, config, TypeColor } from '../../../../../../shared';
import styles from './index.css';
import _ from 'lodash';

type OptionToAdd = 'variations' | 'sellers';

const ColorInformation = (props: { colorManager: UseColorManager }) => {
  const {
    colorManager: {
      colorById,
      runtime,
      loadingQuery,
      errorOnGetColors,
      tempColor,
      saveChangesColorById,
      searchColorsById,
      setTempColor
    }
  } = props;
  const [selectedCard, setSelectedCard] = useState('color');
  const [idCurrentColor, setIdCurrentColor] = useState<string | null>(null);
  const [haveChanges, setHaveChanges] = useState(false);
  const { route } = runtime;
  const [variationList, setVariationList] = useState<string[]>([]);
  const [sellerList, setSellerList] = useState<string[]>([]);
  const [newVariation, setNewVariation] = useState('');
  const [newSeller, setNewSeller] = useState('');
  const [errorKeyVariation, setErrorKeyVariation] = useState('');
  const [errorKeySeller, setErrorKeySeller] = useState('');
  const [haveErrorWithTheUrlId, setHaveErrorWithTheUrlId] = useState(false);

  useEffect(() => {
    if (idCurrentColor) {
      searchColorsById(idCurrentColor);
    }
  }, [idCurrentColor]);

  useEffect(() => {
    if (route.params && route.params.id && route.params.id != '' && route.params.id != null) {
      setIdCurrentColor(route.params.id);
    } else {
      setHaveErrorWithTheUrlId(true);
    }
  }, [route]);

  useEffect(() => {
    const copyColor = colorById ? Object.assign({}, colorById) : null;
    if (copyColor) {
      setSelectedCard(copyColor.type);
      setTempColor(copyColor);
      setHaveChanges(false);
    }
  }, [colorById]);

  useEffect(() => {
    if (tempColor && tempColor.colorName !== '' && tempColor.value !== '') {
      setHaveChanges(!_.isEqual(colorById, tempColor));
    } else {
      setHaveChanges(false);
    }

    if (tempColor) {
      setVariationList(getListFromString(tempColor.variations));
      setSellerList(getListFromString(tempColor.sellers));
    }
  }, [tempColor]);

  const addNewItemSeller = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setErrorKeySeller('');
    if (tempColor && newSeller != '') {
      setTempColor({
        ...tempColor,
        sellers: (tempColor.sellers += `${tempColor.sellers == '' ? '' : ','}${newSeller}`)
      });
      setNewSeller('');
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

  const getListFromString = (text: string) => {
    return text ? text.split(',') : [];
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

  const handlerSaveChanges = () => {
    if (tempColor) {
      saveChangesColorById(tempColor);
    }
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
      if (item !== '') {
        text += `${index != 0 ? ',' : ''}${item}`;
      }
    });
    if (tempColor) {
      setTempColor({ ...tempColor, [key]: text !== '' ? text : null });
    }
  };

  if (errorOnGetColors || haveErrorWithTheUrlId) {
    return (
      <PageBlock>
        <EmptyState title="Color no encontrado">
          <p>Valida que el id proporcionado en la url sea correcto</p>

          <div className="pt5">
            <Button
              variation="secondary"
              size="small"
              onClick={() => {
                runtime.navigate({
                  page: config.colorListRoute
                });
              }}
            >
              <span className="flex align-baseline">Volver</span>
            </Button>
          </div>
        </EmptyState>
      </PageBlock>
    );
  }

  if (loadingQuery || !tempColor) {
    return (
      <PageBlock variation="annotated" title="Buscando color" subtitle="espere un momento...">
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      </PageBlock>
    );
  }

  return (
    <div className="pa5">
      <PageHeader
        title={`${tempColor.colorName == '' ? 'Ingresa un nombre' : tempColor.colorName}`}
        linkLabel="Volver"
        subtitle="Edita la información del color"
        onLinkClick={(_e: any) => {
          runtime.navigate({
            page: config.colorListRoute
          });
        }}
      >
        <span className="mr4">
          <Button variation="primary" disabled={!haveChanges} onClick={() => handlerSaveChanges()}>
            Actualizar
          </Button>
        </span>
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

            <div className="flex">
              <div className="mb5">
                <Input
                  label="Nombre"
                  maxLength={40}
                  errorMessage={!tempColor.colorName ? '¡Campo requerido!' : ''}
                  onChange={(e: any) => setTempColor({ ...tempColor, colorName: e.target.value })}
                  value={tempColor.colorName}
                />
              </div>

              <div className="mb5 ml5">
                <Textarea
                  errorMessage={!tempColor.value ? '¡Campo requerido!' : ''}
                  onChange={(e: any) => setTempColor({ ...tempColor, value: e.target.value })}
                  label="Valor"
                >
                  {tempColor.value}
                </Textarea>
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
              return (
                <span className="mr4 pt4 db" style={{ width: 'auto' }} key={`tag-element${index}`}>
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

export default ColorInformation;
