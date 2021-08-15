import ws from 'ws';
import Koa from "koa";
import mount from "koa-mount";
import graphqlHTTP from "koa-graphql";
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import _logger from "@src/logger";
import config from "@src/config";

import { peridoJobs } from './jobs/ContentTreePublish';

import pubSub from './pubsub';
import schema from './schema';

import "@store/git/filesTree";
import "@store/git/files";
import "@store/git/model";
import { registerListeners } from '@events/rr';


const logger = _logger.child({
  module: "graphQL",
});


registerListeners();


const app = new Koa();


app.use(mount('/graphql', graphqlHTTP({ schema, graphiql: true })));


const server = app.listen(config.port.graphqlEndpoint, async () => {
  const path = '/subscriptions';
  let wsServer;

  try {
    wsServer = new ws.Server({ server, path });
    SubscriptionServer.create({ schema, execute, subscribe, }, wsServer);
  } catch (error) {
    logger.error(`Try to launch the websocket server but failed. `);
    throw error;
  }

  peridoJobs.forEach(f => f(pubSub));
  logger.info(`The GraphQL endpoint has launched and listening to ${config.port.graphqlEndpoint}. `);
  logger.info(`The GraphQL websocket endpoint has launched in [${path}]. `);
});


export default server;
