import http from 'node:http';
import Koa from 'koa';
import logger from '../logger';

export const createServer = (port: number) => {
  const app = new Koa();

  app.use(async (ctx) => {
    ctx.body = 'Hello, world!';
  });

  const server = http.createServer(app.callback());
  server.listen(port);
  logger.info(`Sever listening on ${port}`);

  return server;
};
