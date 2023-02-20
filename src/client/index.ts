import {EventEmitter} from 'node:events';
import {type Configuration} from '../config';
import logger from '../logger';
import Service from './service';

class Client {
  __config: Configuration;
  __services: Record<string, Service>;
  __emitter: EventEmitter;

  constructor(config: Configuration) {
    this.__config = config;
    this.__services = {};
    this.__emitter = new EventEmitter();

    logger.info('Initializing client...');

    for (const service of config.services) {
      this.registerService(service);
    }
  }

  get services() {
    return this.__services;
  }

  on: (typeof this.__emitter)['on'] = (...args) => {
    return this.__emitter.on(...args);
  };

  registerService(service: (typeof this.__config)['services'][number]) {
    const _service = new Service(service.name, service.customStatuses);

    _service.on('statusChange', (newStatus: string) => {
      this.__emitter.emit('serviceStatusChange', {
        name: service.name,
        status: newStatus,
      });
    });

    this.__services[service.name] = _service;

    logger.info(`Registered service ${service.name}`);
  }

  removeService(name: string) {
    if (this.__services[name]) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.__services[name];
      logger.info(`Deleted service ${name}`);
    }
  }

  updateService(name: string, status: string) {
    if (!this.__services[name]) {
      return;
    }

    this.__services[name].status = status;
  }
}

export default Client;
