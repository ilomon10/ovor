import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import App from './App';
import Login from 'pages/login';
import Register from 'pages/register';
import PrivateRoute from './components/privateRoute';
import { FeathersProvider } from 'components/feathers';

const Router = () => {
  return (
    <FeathersProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <PrivateRoute path="/" component={App} />
        </Switch>
      </BrowserRouter>
    </FeathersProvider>
  )
}

export default Router;