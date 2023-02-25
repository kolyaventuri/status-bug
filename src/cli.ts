import process from 'node:process';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {loadConfig} from './config';
import {LOGO} from './constants';
import {createClient} from '.';

const argv = yargs(hideBin(process.argv))
  .options({
    config: {type: 'string', alias: 'c'},
  })
  .parseSync();

const configFile = argv.config ?? argv._[0]?.toString();

(async () => {
  const config = await loadConfig(configFile);

  console.log(LOGO);

  createClient(config);
})();
