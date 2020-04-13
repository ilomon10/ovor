import React from 'react';
import io from 'socket.io-client';
import { server } from './config';

const SocketContext = React.createContext();

class SocketProvider extends React.Component {
  componentDidMount() {
    let host = new URL(window.location.origin);
    host.hostname = server.hostname || window.location.hostname;
    host.port = server.port || window.location.port;
    this.socket = io(host.toString());
  }
  render() {
    const { children } = this.props;
    const socket = this.socket;
    return (
      <SocketContext.Provider value={{ socket }}>
        {children}
      </SocketContext.Provider>
    )
  }
}

export default SocketProvider;