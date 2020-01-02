import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../App';

const Device = () => {
  const { tab } = useContext(AppContext);
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