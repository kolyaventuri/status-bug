import process from 'node:process';
import path from 'node:path';
import fsS, {promises as fs} from 'node:fs';
import {z} from 'zod';
import logger from './logger';

const Service = z.object({
  name: z.string(),
  customStatuses: z.optional(z.array(z.string())),
});
const ConfigSchema = z.object({
  port: z.number().optional(),
  services: z.array(Service),
});

export type Configuration = z.infer<typeof ConfigSchema>;

let configLoaded = false;
let config: Configuration = {
  services: [],
};

export const loadConfig = async (
  configFile: string,
): Promise<Configuration> => {
  if (configLoaded) return config;
  const file = path.resolve(process.cwd(), configFile ?? '');
  const exists = fsS.existsSync(file);
  if (!exists || !configFile) {
    logger.warn('No config file. Using default config...');
    configLoaded = true;
    return config;
  }

  const data = await fs.readFile(file, 'utf8');
  let json: Record<string, unknown>;
  try {
    json = JSON.parse(data) as typeof json;
  } catch (error: unknown) {
    console.error(error);
    throw new Error('Configuration unparseable');
  }

  const parsed = ConfigSchema.safeParse(json);
  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error('Configuration parse error');
  }

  config = parsed.data;
  configLoaded = true;

  return config;
};
