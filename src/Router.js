import React from 'react';
import {
  HashRouter,
  Route,
  Switch
} from 'react-router-dom';
import { FeathersProvider } from 'components/feathers';
import App from './App';
import Login from 'pages/login';
import Register from 'pages/register';
import PrivateRoute from './components/privateRoute';

const Router = () => {
  return (
    <FeathersProvider>
      <HashRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <PrivateRoute path="/" component={App} />
        </Switch>
      </HashRouter>
    </FeathersProvider>
  )
}

export default Router;