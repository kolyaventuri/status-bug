import {type Configuration} from './config';
import SocketClient from './socket-client';
import {createServer} from './http-server';
import Client from './client';

export const createClient = (config: Configuration) => {
  const statusClient = new Client(config);
  const server = createServer();
  const socketClient = new SocketClient(server, config);

  statusClient.on('serviceStatusChanged', (service: string, status: string) => {
    socketClient.sendStatus(service, status);
  });

  return statusClient;
};
