import type http from 'node:http';
import {Server} from 'socket.io';
import {type Configuration} from '../config';
import logger from '../logger';

type ServerType = ReturnType<typeof http.createServer>;

const TIMEOUT = 5000;

class SocketClient {
  __config: Configuration;
  __socket: Server;

  constructor(server: ServerType, config: Configuration) {
    this.__config = config;
    this.__socket = new Server(server);

    this.__socket.on('connection', (client) => {
      logger.info('Client conneted.');

      client.on('identify', (type: string) => {
        logger.info(`Client ${client.id} identified as ${type}`);
      });

      client.on('disconnect', () => {
        logger.info(`Client ${client.id} disconnected.`);
      });

      setTimeout(() => {
        client.disconnect();
        logger.info(`Client ${client.id} did not identify within timeout`);
      }, TIMEOUT);
    });

    logger.info('Socket client initialized');
  }

  sendStatus(service: string, status: string) {
    this.__socket.emit('statusChange', {
      service,
      status,
    });
  }
}

export default SocketClient;
