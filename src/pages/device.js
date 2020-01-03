import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { TabContext } from '../components/tabSystem';

const Device = () => {
  const tab = useContext(TabContext);
  const location = useLocation();
  useEffect(() => {
    tab.setCurrentTabState({
      title: 'Device',
      path: location.pathname
    })
  }, [])
  return ('Device')
}

export default Device;