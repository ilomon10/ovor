import { useEffect, useContext } from 'react';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ('Settings')
}

export default Settings;