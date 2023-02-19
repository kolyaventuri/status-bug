import process from 'node:process';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers.mjs';
import {loadConfig} from './config';

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

  console.log(config);
})();
