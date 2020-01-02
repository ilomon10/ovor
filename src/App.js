import React, {
  useState,
  useEffect
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
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const history = useHistory();
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
  const addNewTab = () => {
    changeActiveTab(0);
    setTabs(() => {
      history.push('/');
      return ([{
        title: "New Tab",
        path: "/"
      }, ...tabs])
    })
  }
  const changeActiveTab = (id) => setActiveTab(id);
  const removeTab = (id) => setTabs(() => ([
    ...tabs.filter((...x) => x[1] !== id)
  ]));
  const setCurrentTabState = ({ title, path }) => setTabs(() => {
    return ([
      ...tabs.map((v, i) => {
        if (i === activeTab) return { title, path };
        return v;
      })
    ])
  })
  useEffect(() => {
    if (tabs.length === 0) addNewTab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs.length]);
  return (
    <Container className="flex">
      <AppContext.Provider value={{
        tab: {
          tabs: [...tabs],
          activeTab,
          changeActiveTab,
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
