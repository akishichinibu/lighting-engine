import Koa from "koa";
import _ from "lodash-es";
import { join, dirname, basename } from "path";
import { compile } from "ejs";

import _logger from "@src/logger";
import config from "@src/config";

import ProtoType from "@model/container/prototype";
import ContentDocument from "@model/container/document";

import ControllerBundleBuilder from "../compile/bundlePacker";

import { buildRequester } from "@events/rr";
import * as execute from "@events/sandbox/execute";

import "@store/git/filesTree";
import "@store/git/files";
import "@store/git/model";

import * as loadProtoType from "@src/events/prototype/load";
import * as loadDocument from "@src/events/document/load";


const logger = _logger.child({
  module: "render",
});


const sandboxRequester = buildRequester<execute.RequestPayload, execute.ResponsePayload>(execute.ACTION_SANDBOX_EXECUTE);

const protoTypeRequester = buildRequester<loadProtoType.RequestPayload, loadProtoType.ResponsePayload>(loadProtoType.ACTION_LOAD_PROTOTYPE);

const documentRequester = buildRequester<loadDocument.RequestPayload, loadDocument.ResponsePayload>(loadDocument.ACTION_LOAD_DOCUMENT);


const app = new Koa();


// async function controllerExecute(protoTypeUri: string, protoType: ProtoType, contentDocument: ContentDocument) {
//   const name = protoType.name;

//   const { controllerScript } = await protoTypeRequester({ name })
//   const scriptBuilder = await ControllerBundleBuilder.create(protoTypeUri);
//   const scriptFuture = scriptBuilder.compile({});

//   const inputFuture = accessor.loadContentContext(protoType, contentDocument);
  
//   let payload: RequestPayload;

//   try {
//     payload = {
//       name,
//       script: (await scriptFuture).bundle,
//       input: await inputFuture,
//     }
//   } catch (error) {
//     logger.error(error);
//     return {};
//   }

//   const result = await sandboxRequester(payload);
//   return result.output;
// }


app.use(async (ctx) => {
  let url = ctx.path;

  if (url[0] === "/") {
    url = url.slice(1, url.length);
  }

  const contentPath = join(dirname(url), `${basename(url)}.yaml`);

  logger.info(`try to load the content model in [${contentPath}]. `);
  const { document } = await documentRequester({ path: contentPath });
  logger.info(`load ContentDocument with id [${document.id}] success. `);

  logger.info(`Try to load the protoType [${document.proto}]. `);
  const { protoType, template, controllerScript } = await protoTypeRequester({ name: document.proto });
  logger.info(`load protoType [${document.proto}] success. `);

  // const evaluateTask = controllerExecute(``, protoType, document);
  const templateFunFuture = compile(template, { async: true });

  const [/*result , */templateFun] = await Promise.all([
    // evaluateTask,
    templateFunFuture,
  ]);

  ctx.body = templateFun({ f1: "hello", f2: "world" });
});


const server = app.listen(config.port.previewEndpoint, () => {
  logger.info(`The preview service has launched and listening to ${config.port.previewEndpoint}. `);
});


export default server;
