import http from 'node:http';
import Koa from 'koa';
import logger from '../logger';

const PORT = 9537;

export const createServer = () => {
  const app = new Koa();

  app.use(async (ctx) => {
    ctx.body = 'Hello, world!';
  });

  const server = http.createServer(app.callback());
  server.listen(PORT);
  logger.info(`Sever listening on ${PORT}`);

  return server;
};
