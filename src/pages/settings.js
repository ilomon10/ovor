import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../App';

const Settings = () => {
  const { tab } = useContext(AppContext);
  const location = useLocation();
  useEffect(() => {
    tab.setCurrentTabState({
      title: 'Settings',
      path: location.pathname
    })
  }, [])
  return ('Settings')
}

export default Settings;