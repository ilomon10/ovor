import React from 'react';
import {
  Switch,
  Route
} from 'react-router-dom';
import styled from 'styled-components';

import Sidebar from './components/sidebar';
import Topbar from './components/topbar';
import TabSystem from './components/tabSystem';
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

const App = () => {
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
  return (
    <Container className="flex">
      <TabSystem>
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
      </TabSystem>
    </Container>
  );
}

export default App;
