import React, { useEffect, useState } from 'react';
import { useRuntime } from 'vtex.render-runtime';
import { Tab, Tabs, ToastConsumer, ToastProvider } from 'vtex.styleguide';
import { ColorConfigurationContext, ColorsContext, SellersContext } from '../../Context';
import { config, ToastRenderProps } from '../../shared';
import ColorsGenerationTemplate from './GenerationTemplates/TableTemplate';
import SellersModule from './SellersModule';
import UploadColors from './UploadColors';

const { ColorsConfigurationProvider } = ColorConfigurationContext;
const { SellersProvider } = SellersContext;
const { ColorsProvider, useColors } = ColorsContext;

type TabsDistribution = 'colorsUpload' | 'generateTemplate' | 'sellers';

const TabsComponent = () => {
  const state = useColors();
  const handleReset = state ? state.uploadColorsManager.handleReset : () => {};
  const [currentTab, setCurrentTab] = useState<TabsDistribution>('colorsUpload');
  const { route, navigate } = useRuntime();

  useEffect(() => {
    if (route.params && route.params.id) {
      const id = route.params.id;
      if (isOfTypeTabs(id)) {
        setCurrentTab(id);
      } else {
        navigate({
          page: config.colorConfiguration,
          params: { id: 'colorsUpload' }
        });
      }
    }
  }, [route]);

  function isOfTypeTabs(keyInput: string): keyInput is TabsDistribution {
    return ['colorsUpload', 'generateTemplate', 'sellers'].includes(keyInput);
  }

  const handlerNavigateToTab = (id: TabsDistribution) => {
    handleReset();
    setCurrentTab(id);
    navigate({
      page: config.colorConfiguration,
      params: { id: id }
    });
  };

  return (
    <Tabs>
      <Tab
        label="Carga de colores"
        active={currentTab === 'colorsUpload'}
        onClick={() => handlerNavigateToTab('colorsUpload')}
      >
        <div className="mt6">
          <UploadColors />
        </div>
      </Tab>
      <Tab
        label="Generación de plantilla"
        active={currentTab === 'generateTemplate'}
        onClick={() => handlerNavigateToTab('generateTemplate')}
      >
        <div className="mt6">
          <ColorsGenerationTemplate />
        </div>
      </Tab>
      <Tab
        label="Configuración de los vendedores"
        active={currentTab === 'sellers'}
        onClick={() => handlerNavigateToTab('sellers')}
      >
        <div className="mt6">
          <SellersModule />
        </div>
      </Tab>
    </Tabs>
  );
};

const WrapperTabsColorsConfiguration = () => {
  return (
    <ToastProvider positioning="window">
      <ToastConsumer>
        {({ showToast }: ToastRenderProps) => (
          <ColorsProvider {...{ showToast }}>
            <SellersProvider {...{ showToast }}>
              <ColorsConfigurationProvider {...{ showToast }}>
                <TabsComponent></TabsComponent>
              </ColorsConfigurationProvider>
            </SellersProvider>
          </ColorsProvider>
        )}
      </ToastConsumer>
    </ToastProvider>
  );
};

export default WrapperTabsColorsConfiguration;
