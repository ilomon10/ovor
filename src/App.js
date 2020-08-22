import React from 'react';
import {
  Switch,
  Route
} from 'react-router-dom';
import styled from 'styled-components';

import Sidebar from 'components/sidebar';
import Overview from 'pages/overview';
import Dashboards from 'pages/dashboard/browse';
import Dashboard from 'pages/dashboard/';
import Devices from 'pages/device/browse';
import Device from 'pages/device/';
import Settings from 'pages/settings';
import Tokens from 'pages/tokens';
import ReteEngine from 'pages/reteEngine';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0%;
  right: 0%;
  bottom: 0;
`

const App = () => {
  const navigation = [{
    title: 'Overview',
    icon: 'dashboard',
    path: '/',
    component: Overview,
    exact: true,
    navExact: true
  }, {
    hide: true,
    title: 'Dashboard',
    path: '/dashboards/:id',
    component: Dashboard,
    exact: true
  }, {
    hide: true,
    title: 'Device',
    path: '/devices/:id',
    component: Device,
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
    component: Devices,
    exact: true
  }, {
    title: 'Rete Engine',
    icon: 'graph',
    path: '/rete',
    component: ReteEngine,
    exact: true
  }, {
    title: 'Tokens',
    icon: 'key',
    path: '/tokens',
    component: Tokens
  }, {
    title: 'Settings',
    icon: 'cog',
    path: '/settings',
    component: Settings
  }]
  return (
    <Container className="flex">
      <Sidebar className="flex-shrink-0" items={navigation} />
      <div className="flex-grow flex flex--col" style={{ position: 'relative' }}>
        <div className="flex-grow">
          <Switch>
            {navigation.map((v) => (
              <Route key={v.path} path={v.path} name={v.title} component={v.component} exact={v.exact} />
            ))}
          </Switch>
        </div>
      </div>
    </Container>
  );
}

export default App;
