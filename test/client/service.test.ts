import {EventEmitter} from 'node:events';
import {beforeEach, test as t, assert, expect, vi} from 'vitest';

import Service from '~/client/service';

const NAME = 'service-name';

type Context = {service: Service};
const test = t<Context>;

beforeEach<Context>(async (context) => {
  context.service = new Service(NAME);
});

test('A service can be created with custom statuses', () => {
  const service = new Service(NAME, ['a', 'b']);

  expect(service.__customStatuses).toStrictEqual(['a', 'b']);
});

test('A service has an emitter', ({service}) => {
  assert.instanceOf(service.__emitter, EventEmitter);
});

test('A service is initialized with UNKNOWN status', ({service}) => {
  expect(service.status).toEqual('UNKNOWN');
});

test('A service can have its status set', ({service}) => {
  service.status = 'ALIVE';

  expect(service.status).toEqual('ALIVE');
});

test('A custom service can have its own status set', () => {
  const service = new Service(NAME, ['a']);

  service.status = 'a';

  expect(service.status).toEqual('a');
});

test('Service#addStatus can define a new status', ({service}) => {
  const status = 'newstatus';
  service.addStatus(status);

  expect(service.__customStatuses?.includes(status)).toEqual(true);
});

test('Service#on binds to the event listener', ({service}) => {
  const fn = () => 2;

  service.on('statusChange', fn);

  expect(service.__emitter.listeners('statusChange')[0]).toBe(fn);
});

test('When the status changes, fires the statusChange event', ({service}) => {
  const listener = vi.fn();

  service.on('statusChange', listener);

  service.status = 'ALIVE';

  expect(listener).toHaveBeenCalledWith('ALIVE');
});
