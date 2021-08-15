import { buildListener, buildRequester } from "@src/events/rr";

import * as read from "@src/events/files/read";
import * as loadDocument from "@src/events/document/load";
import * as loadProtoType from "@src/events/prototype/load";

import ContentDocument from "@model/container/document";
import ProtoType from "@model/container/prototype";
import { join } from "path";


const readFileRequester = buildRequester<read.RequestPayload, read.ResponsePayload>(read.ACTION_READ_FILE);


buildListener<loadDocument.RequestPayload, loadDocument.ResponsePayload>(
  loadDocument.ACTION_LOAD_DOCUMENT,
  async ({ path }) => {
    
    const { data } = await readFileRequester({ path });
    const document = await ContentDocument.deserialize(path, data);
    
    let payload: loadDocument.ResponsePayload = {
      document
    }

    return [payload, null];
  }
);


buildListener<loadProtoType.RequestPayload, loadProtoType.ResponsePayload>(
  loadProtoType.ACTION_LOAD_PROTOTYPE,
  async ({ name }) => {

    const root = join("/prototype", name);

    const configFuture = readFileRequester({ path: join(root, "config.yaml") });
    const templateFuture = readFileRequester({ path: join(root, "template.ejs") });
    const controllerFuture = readFileRequester({ path: join(root, "controller.ts") });

    const [config, template, controller] = await Promise.all([configFuture, templateFuture, controllerFuture]);
    
    const protoTypeFuture = ProtoType.deserialize(name, config.data);
    
    let payload: loadProtoType.ResponsePayload = {
      protoType: await protoTypeFuture,
      template: template.data,
      controllerScript: controller.data,
    }

    return [payload, null];
  }
);
