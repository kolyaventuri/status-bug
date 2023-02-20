import {EventEmitter} from 'node:events';
import {z} from 'zod';
import logger from '../logger';

const defaultStatusNames = ['ALIVE', 'DEAD', 'UNAVAILABLE', 'UNKNOWN'] as const;
const defaultStatus = z.enum(defaultStatusNames);

class StatusParseError extends Error {}

class Service {
  __name: string;
  __status = 'UNKNOWN';
  __customStatuses?: string[];
  __emitter: EventEmitter;

  constructor(name: string, customStatuses?: string[]) {
    this.__name = name;
    this.__customStatuses = customStatuses;
    this.__emitter = new EventEmitter();
  }

  get status(): typeof this.__status {
    return this.__status;
  }

  set status(value: string) {
    try {
      defaultStatus.parse(value);
      if (!this.__customStatuses?.includes(value)) {
        throw new Error('Not found in custom status array.');
      }
    } catch (error: unknown) {
      logger.error(error);
      throw new StatusParseError(
        `"${value}" is not a valid status for Service "${this.__name}"`,
      );
    }

    this.__status = value;

    this.__emitter.emit('statusChange', this.__status);
    logger.info(`Service "${this.__name}" now has status "${this.__status}"`);
  }

  on: (typeof this.__emitter)['on'] = (...args) => {
    return this.__emitter.on(...args);
  };

  addStatus(name: string) {
    const _name = name as (typeof defaultStatusNames)[number];
    if (
      defaultStatusNames.includes(_name) ||
      this.__customStatuses?.includes(name)
    ) {
      throw new Error(
        `Status "${name}" already exists on the service ${this.__name}`,
      );
    }

    if (!this.__customStatuses) {
      this.__customStatuses = [];
    }

    this.__customStatuses.push(name);
    logger.info(`Added status "${name}" to Service "${this.__name}"`);
  }
}

export default Service;
