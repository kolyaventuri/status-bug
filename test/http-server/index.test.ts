import {Server} from 'node:http';
import {test, assert, expect} from 'vitest';
import type {AddressInfo} from 'ws';
import {createServer} from '~/http-server';

const PORT = 9537;
test('#createServer exports an http-server listening on the default port', () => {
  const server = createServer(PORT);

  assert.instanceOf(server, Server);
  expect((server.address() as AddressInfo).port).toEqual(PORT);
});
