import React, {
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react';
import {
  Switch,
  Route,
  useHistory
} from 'react-router-dom';
import styled from 'styled-components';

import Sidebar from './components/sidebar';
import Topbar from './components/topbar';
import Dashboards from './pages/dashboards';
import Dashboard from './pages/dashboard';
import Devices from './pages/devices';
import Settings from './pages/settings';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0%;
  right: 0%;
  bottom: 0;
`

export const AppContext = React.createContext({
  tab: {
    tabs: [],
    activeTab: null,
    setActiveTab: () => { },
    addNewTab: () => { },
    removeTab: () => { },
  }
});

const App = () => {
  const [tabs, setTabs] = useState(JSON.parse(localStorage.getItem('ovor.tabs')) || []);
  const [activeTab, setActiveTab] = useState(JSON.parse(localStorage.getItem('ovor.activeTab')) || 0);
  const history = useHistory();
  const prevTabs = useRef([]);
  const navigation = [{
    hide: true,
    title: 'Dashboard',
    path: '/dashboards/:id',
    component: Dashboard,
    exact: true
  }, {
    title: 'Dashboards',
    icon: 'application',
    path: '/dashboards',
    component: Dashboards,
    exact: true
  }, {
    title: 'Devices',
    icon: 'helper-management',
    path: '/devices',
    component: Devices
  }, {
    title: 'Settings',
    icon: 'cog',
    path: '/settings',
    component: Settings
  }]
  const changeActiveTab = useCallback((id) => {
    let index = id;
    let tab = tabs[index];
    if (tab === undefined) {
      index = tabs.length - 1;
      index = index < 0 ? 0 : index;
      tab = tabs[index];
    };
    setActiveTab(index);
    history.push(tab.path);
  }, [tabs, history]);
  const addNewTab = useCallback(() => {
    setTabs(() => {
      return ([{
        title: "New Tab",
        path: "/"
      }, ...tabs])
    });
  }, [tabs, changeActiveTab]);
  const removeTab = useCallback((id) => {
    if (id < activeTab) setActiveTab(activeTab - 1);
    setTabs(() => ([...tabs.filter((...x) => x[1] !== id)]));
  }, [activeTab, tabs]);
  const setCurrentTabState = useCallback(({ title, path }) => setTabs(() => {
    return ([
      ...tabs.map((v, i) => {
        if (i === activeTab) return { title, path };
        return v;
      })
    ]);
  }), [activeTab, tabs]);
  useEffect(() => {
    const tabsStore = JSON.parse(localStorage.getItem('ovor.tabs'));
    if (localStorage.getItem('ovor.tabs') === null) addNewTab();
    if (JSON.stringify(tabsStore) !== JSON.stringify(tabs)) localStorage.setItem('ovor.tabs', JSON.stringify(tabs));
    if (prevTabs.current.length !== 0
      && JSON.stringify(tabs[activeTab]) !== JSON.stringify(prevTabs.current[activeTab])) changeActiveTab(activeTab);
    prevTabs.current = tabs;
  }, [tabs, addNewTab]);
  useEffect(() => {
    const activeTabStore = parseInt(localStorage.getItem('ovor.activeTab'));
    if (activeTabStore !== activeTab) localStorage.setItem('ovor.activeTab', activeTab);
  }, [activeTab])
  return (
    <Container className="flex">
      <AppContext.Provider value={{
        tab: {
          tabs: [...tabs],
          activeTab,
          changeActiveTab,
          setActiveTab,
          addNewTab,
          removeTab,
          setCurrentTabState
        }
      }}>
        <Sidebar className="flex-shrink-0" items={navigation} />
        <div className="flex-grow flex flex--col" style={{ position: 'relative' }}>
          <Topbar className="flex-shrink-0" />
          <div className="flex-grow">
            <Switch>
              {navigation.map((v, i) => (
                <Route key={v.path} path={v.path} name={v.title} component={v.component} exact={v.exact} />
              ))}
            </Switch>
          </div>
        </div>
      </AppContext.Provider>
    </Container>
  );
}

export default App;
