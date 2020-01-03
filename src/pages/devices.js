import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { TabContext } from "../components/tabSystem";

const Devices = () => {
  const tab = useContext(TabContext);
  const location = useLocation();
  useEffect(() => {
    tab.setCurrentTabState({
      title: 'Devices',
      path: location.pathname
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ('Devices')
}

export default Devices;