import {beforeEach, test as _t, assert, expect} from 'vitest';
import config from '@fixtures/config.json';

import Client from '~/client';
import Service from '~/client/service';

type Context = {client: Client};
const test = _t<Context>;

beforeEach<Context>(async (context) => {
  context.client = new Client(config);
});

test('Client registers services from config', ({client}) => {
  for (const service of config.services) {
    assert.instanceOf(client.__services[service.name], Service);
  }
});

test('Client#registerService registers a new service', ({client}) => {
  const service = {name: 'ABC-2'};

  client.registerService(service);

  assert.instanceOf(client.__services[service.name], Service);
});

test('Client#removeService deletes a service', ({client}) => {
  const service = {name: 'ABC-2'};
  client.registerService(service);

  client.removeService(service.name);

  assert.notExists(client.__services[service.name]);
});

test('Client#updateService sets the status of the service', ({client}) => {
  const {name} = config.services[0];

  client.updateService(name, 'DEAD');

  expect(client.__services[name].status).toEqual('DEAD');
});
