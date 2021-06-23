import React, { useContext } from 'react';
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

  get dashboards() { return this.client.service('dashboards'); }
  get devices() { return this.client.service('devices'); }
  get dataLake() { return this.client.service('data-lake'); }
  get tokens() { return this.client.service('tokens'); }
  get retes() { return this.client.service('rete'); }
  get users() { return this.client.service('users'); }
  get logger() { return this.client.service('logger'); }
  get dataSources() { return this.client.service('data-sources'); }
  get testa() { return this.client.service('testa'); }

}

export const FeathersContext = React.createContext(null);

export const FeathersProvider = ({ children }) => {
  return (
    <FeathersContext.Provider value={new Feathers()}>
      {children}
    </FeathersContext.Provider>
  )
}

export const useFeathers = () => {
  const feathers = useContext(FeathersContext);
  return feathers;
}