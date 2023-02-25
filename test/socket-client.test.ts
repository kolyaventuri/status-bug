import {beforeEach, test as t, assert, expect, vi, afterEach} from 'vitest';
import config from '@fixtures/config.json';
import {Server} from 'socket.io';
import {createServer} from '~/http-server';
import SocketClient from '~/socket-client';

type Context = {
  server: ReturnType<typeof createServer>;
  socket: SocketClient;
};

const test = t<Context>;

beforeEach<Context>(async (context) => {
  context.server = createServer();
  context.socket = new SocketClient(context.server, config);
});

afterEach<Context>(async (context) => {
  context.server.close();
});

test('SocketClient creates a new socket.io server', ({socket}) => {
  assert.instanceOf(socket.__socket, Server);
});

test('SocketClient#sendStatus emits a statusChange event', ({socket}) => {
  socket.__socket.emit = vi.fn();
  socket.sendStatus('service', 'status');

  expect(socket.__socket.emit).toHaveBeenCalledWith('statusChange', {
    service: 'service',
    status: 'status',
  });
});
