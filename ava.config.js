const config = {
  extensions: [
    'ts',
    'tsx'
  ],
  files: [
    'test/**/*.test.ts?(x)'
  ],
  require: [
    'esm',
    'ts-node/register',
    'tsconfig-paths/register',
  ]
};

export default config;
