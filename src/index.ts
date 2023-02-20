import process from 'node:process';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import Client from './client';
import {loadConfig} from './config';
import {LOGO} from './constants';
import SocketClient from './socket-client';
import {createServer} from './http-server';

const argv = yargs(hideBin(process.argv))
  .options({
    config: {type: 'string', alias: 'c'},
  })
  .parseSync();

const configFile = argv.config ?? argv._[0]?.toString();

if (!configFile) {
  throw new Error('Configuration file was not provided.');
}

(async () => {
  const config = await loadConfig(configFile);

  console.log(LOGO);

  const statusClient = new Client(config);
  const server = createServer();
  const socketClient = new SocketClient(server, config);

  statusClient.on('serviceStatusChanged', (service: string, status: string) => {
    socketClient.sendStatus(service, status);
  });
})();
