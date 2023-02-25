import {type Configuration} from './config';
import SocketClient from './socket-client';
import {createServer} from './http-server';
import Client from './client';

const defaultConfig: Configuration = {
  port: 9537,
  services: [],
};

export const createClient = (_config?: Configuration) => {
  const config = _config ?? defaultConfig;
  const statusClient = new Client(config);
  const server = createServer(config.port ?? defaultConfig.port!);
  const socketClient = new SocketClient(server, config);

  statusClient.on('serviceStatusChanged', ({name, status}) => {
    socketClient.sendStatus(name, status);
  });

  return statusClient;
};
