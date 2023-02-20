import path from 'node:path';
import fs from 'node:fs';

// eslint-disable-next-line unicorn/prefer-module
const file = path.join(__dirname, 'logo.txt');
export const LOGO = fs.readFileSync(file, 'utf8').toString();
