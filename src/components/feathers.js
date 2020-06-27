import React from 'react';
import feathers from '@feathersjs/feathers';
import feathersAuth from '@feathersjs/authentication-client';
import feathersSocket from '@feathersjs/socketio-client';
import io from 'socket.io-client';
import { server } from './config';

class Feathers {
  constructor() {
    let host = new URL(window.location.origin);
    host.hostname = server.hostname || window.location.hostname;
    host.port = server.port || window.location.port;
    const socket = io(host.toString());

    this.client = feathers();
    this.client.configure(feathersSocket(socket));
    this.client.configure(feathersAuth({
      storageKey: "accessToken"
    }))
  }

  doAuthenticate(authentication, params) {
    return this.client.authenticate(authentication, params);
  }
  doLogout() {
    return this.client.logout();
  }
  doReAuthenticate(force) {
    return this.client.reAuthenticate(force);
  }
  doGet(name) {
    return this.client.get(name);
  }

  dashboards = () => this.client.service('dashboards');
  devices = () => this.client.service('devices');
  dataLake = () => this.client.service('data-lake');
  tokens = () => this.client.service('tokens');

}

export const FeathersContext = React.createContext(null);

export const FeathersProvider = ({ children }) => {
  return (
    <FeathersContext.Provider value={new Feathers()}>
      {children}
    </FeathersContext.Provider>
  )
}