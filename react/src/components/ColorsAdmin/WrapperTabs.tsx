import React, { useEffect, useState } from 'react';
import { useRuntime } from 'vtex.render-runtime';
import { ToastConsumer, ToastProvider } from 'vtex.styleguide';
import { ColorsApprovalContext, ColorsContext } from '../../Context';
import { config, TabsDistribution, ToastRenderProps } from '../../shared';
import TabsComponent from './TabsComponent';
const { ColorsProvider } = ColorsContext;
const { ColorsApprovalProvider } = ColorsApprovalContext;

const WrapperTabs = () => {
  const [currentTab, setCurrentTab] = useState<TabsDistribution>('colors');
  const { route, navigate } = useRuntime();

  useEffect(() => {
    if (route.params && route.params.id) {
      const id = route.params.id;
      if (isOfTypeTabs(id)) {
        setCurrentTab(id);
      } else {
        navigate({
          page: config.colorAdminTabRoute,
          params: { id: 'colors' }
        });
      }
    }
  }, [route]);

  function isOfTypeTabs(keyInput: string): keyInput is TabsDistribution {
    return ['colors', 'approbation'].includes(keyInput);
  }

  const handlerNavigateToTab = (id: TabsDistribution) => {
    setCurrentTab(id);
    navigate({
      page: config.colorAdminTabRoute,
      params: { id: id }
    });
  };

  return (
    <ToastProvider positioning="window">
      <ToastConsumer>
        {({ showToast }: ToastRenderProps) => (
          <ColorsProvider {...{ showToast }}>
            <ColorsApprovalProvider {...{ showToast }}>
              <TabsComponent {...{ currentTab, handlerNavigateToTab }} />
            </ColorsApprovalProvider>
          </ColorsProvider>
        )}
      </ToastConsumer>
    </ToastProvider>
  );
};

export default WrapperTabs;
