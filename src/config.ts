import process from 'node:process';
import path from 'node:path';
import fsS, {promises as fs} from 'node:fs';
import {z} from 'zod';

const Service = z.object({
  name: z.string(),
  customStatuses: z.optional(z.array(z.string())),
});
const ConfigSchema = z.object({
  services: z.array(Service),
});

export type Configuration = z.infer<typeof ConfigSchema>;

let config: Configuration;

export const loadConfig = async (
  configFile: string,
): Promise<Configuration> => {
  if (config) return config;
  const file = path.resolve(process.cwd(), configFile);
  const exists = fsS.existsSync(file);
  if (!exists) {
    throw new Error('Configuation file missing...');
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

  return config;
};
