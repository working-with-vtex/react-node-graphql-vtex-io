import React, { useEffect, useState } from 'react';
import { Tab, Tabs, Tag } from 'vtex.styleguide';
import { IColorsApproval, TabsDistribution, UseColorApprovalManager } from '../../shared';
import ApprovalModule from './ApprovalModule';
import ColorsModule from './ColorsModule';
import styles from './index.css';
import { ColorsApprovalContext } from '../../Context';
const { useColorsApproval } = ColorsApprovalContext;

interface WrapperProps {
  currentTab: TabsDistribution;
  handlerNavigateToTab: (id: TabsDistribution) => void;
}

interface Props extends WrapperProps {
  colorApprovalManager: UseColorApprovalManager;
}

const TabsComponent = ({ currentTab, handlerNavigateToTab, colorApprovalManager }: Props) => {
  const { searchColorWithState, colorsApprovalList } = colorApprovalManager;
  const [colorsPending, setColorsPending] = useState<IColorsApproval[]>([]);

  useEffect(() => {
    searchColorWithState('pending');
  }, []);

  useEffect(() => {
    if (colorsApprovalList) {
      setColorsPending(colorsApprovalList.filter((item) => item.state == 'pending'));
    }
  }, [colorsApprovalList]);

  return (
    <Tabs>
      <Tab label="Colores" active={currentTab === 'colors'} onClick={() => handlerNavigateToTab('colors')}>
        <div className="mt6">
          <ColorsModule />
        </div>
      </Tab>
      <Tab
        label={
          <div className={styles.tabElement}>
            <p className={styles.tabText}>Aprobación de colores </p>
            <div className={styles.tabBadge}>
              <Tag type="error">{colorsPending.length}</Tag>
            </div>
          </div>
        }
        active={currentTab === 'approbation'}
        onClick={() => handlerNavigateToTab('approbation')}
      >
        <div className="mt6">
          <ApprovalModule />
        </div>
      </Tab>
    </Tabs>
  );
};

const WrapperTabs = (props: WrapperProps) => {
  const state = useColorsApproval();
  if (!state) return null;

  return (
    <TabsComponent
      {...{
        ...state,
        ...props
      }}
    />
  );
};

export default WrapperTabs;
