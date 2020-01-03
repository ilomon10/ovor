import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { TabContext } from "../components/tabSystem";

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
  return ('Settings')
}

export default Settings;