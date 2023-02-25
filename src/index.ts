import {loadConfig, type Configuration} from './config';
import SocketClient from './socket-client';
import {createServer} from './http-server';
import Client from './client';

const defaultConfig: Configuration & {port: number} = {
  port: 9537,
  services: [],
};

export function createClient(_config?: Configuration | string) {
  let temporaryConfig = _config ?? defaultConfig;
  if (typeof _config === 'string') {
    temporaryConfig = loadConfig(_config);
  }

  const config = temporaryConfig as Configuration;

  const statusClient = new Client(config);
  const server = createServer(config.port ?? defaultConfig.port);
  const socketClient = new SocketClient(server, config);

  statusClient.on('serviceStatusChanged', ({name, status}) => {
    socketClient.sendStatus(name, status);
  });

  return statusClient;
}
