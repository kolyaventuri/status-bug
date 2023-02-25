import {assert, expect, test, vi} from 'vitest';
import goodConfig from '@fixtures/config.json';
import Client from '~/client';
import {createClient} from '~/index';

const fn = vi.fn();

vi.mock('~/socket-client', () => ({
  default: class MockSocket {
    sendStatus = vi.fn().mockImplementation(fn);
  },
}));

test('#createClient returns a status client', () => {
  const client = createClient(goodConfig);

  assert.instanceOf(client, Client);
  const listener = client.__emitter.listeners('serviceStatusChanged')[0];
  assert.exists(listener);

  const args = {name: 'a', status: 'b'};
  listener(args);

  expect(fn).toHaveBeenCalledWith(args.name, args.status);
});
