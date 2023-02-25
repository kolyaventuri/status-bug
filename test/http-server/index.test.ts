import {Server} from 'node:http';
import {test, assert, expect} from 'vitest';
import type {AddressInfo} from 'ws';
import {createServer} from '~/http-server';

test('#createServer exports an http-server listening on the default port', () => {
  const server = createServer();

  assert.instanceOf(server, Server);
  expect((server.address() as AddressInfo).port).toEqual(9537);
});
