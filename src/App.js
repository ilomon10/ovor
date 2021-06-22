import React, { useContext, useEffect, useState } from 'react';
import {
  Switch,
  Route
} from 'react-router-dom';
import styled from 'styled-components';

import Sidebar from 'components/sidebar';
import { FeathersContext } from 'components/feathers';

import Overview from 'pages/overview';
import Dashboards from 'pages/dashboard/browse';
import Dashboard from 'pages/dashboard/';
import Devices from 'pages/device/browse';
import Device from 'pages/device/';
import DataSources from 'pages/dataSources/browse';
import DataSource from 'pages/dataSources/';
import Testa from 'pages/testa/browse';
import SarafTesta from 'pages/testa/';
import Settings from 'pages/settings';
import Tokens from 'pages/tokens';
import Users from 'pages/admin/users/browse';
import User from 'pages/admin/users/';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0%;
  right: 0%;
  bottom: 0;
`

const nav = [{
  title: 'Overview',
  icon: 'dashboard',
  path: '/',
  component: Overview,
  exact: true,
  navExact: true,
  permission: 'public'
}, {
  hide: true,
  title: 'Dashboard',
  path: '/dashboards/:id',
  component: Dashboard,
  exact: true,
  permission: 'public'
}, {
  hide: true,
  title: 'Ember',
  path: '/ember/:id',
  component: DataSource,
  exact: true,
  permission: 'public'
}, {
  hide: true,
  title: 'Saraf Testa',
  path: '/testa/saraf/:id',
  component: SarafTesta,
  exact: true,
  permission: 'public'
}, {
  hide: true,
  title: 'Device',
  path: '/devices/:id',
  component: Device,
  exact: true,
  permission: 'public'
}, {
  title: 'Dashboards',
  icon: 'application',
  path: '/dashboards',
  component: Dashboards,
  exact: true,
  permission: 'public'
}, {
  title: 'Ember',
  icon: 'full-stacked-chart',
  path: '/ember',
  component: DataSources,
  exact: true,
  permission: 'public'
}, {
  title: 'Devices',
  icon: 'helper-management',
  path: '/devices',
  component: Devices,
  exact: true,
  permission: 'public'
}, {
  title: 'Testa',
  icon: 'predictive-analysis',
  path: '/testa',
  component: Testa,
  exact: true,
  permission: 'public'
}, {
  title: 'Tokens',
  icon: 'key',
  path: '/tokens',
  component: Tokens,
  permission: 'public'
}, {
  title: 'Settings',
  icon: 'cog',
  path: '/settings',
  component: Settings,
  permission: 'public'
}, {
  hide: true,
  title: 'User Manager',
  path: '/users/:id',
  component: User,
  exact: true,
  permission: 'admin'
}, {
  title: 'User Manager',
  icon: 'people',
  path: '/users',
  component: Users,
  permission: 'admin'
}];

const App = () => {
  const feathers = useContext(FeathersContext);
  const [currentUser, setCurrentUser] = useState({
    permissions: []
  });
  const navigation = nav.filter((v) => {
    return currentUser.permissions.indexOf(v.permission) !== -1;
  });
  useEffect(() => {
    const fetch = async () => {
      const { user } = await feathers.client.get('authentication')
      setCurrentUser(user);
    }
    fetch();
  }, [feathers]);

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
