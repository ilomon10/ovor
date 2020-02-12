import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { TabContext } from "components/tabSystem";
import { NonIdealState } from '@blueprintjs/core';

const Settings = () => {
  const tab = useContext(TabContext);
  const location = useLocation();
  useEffect(() => {
    tab.setCurrentTabState({
      title: 'Settings',
      path: location.pathname
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <NonIdealState
      icon="code-block"
      title="Sorry guys"
      description={(<>
        <span>This page is under maintenance.</span>
        <br />
        <span>Please come back again soon.</span>
      </>)} />
  )
}

export default Settings;