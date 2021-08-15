import { readFile } from "fs/promises";
import { join } from "path";

import emitter from "@src/events/emitter";
import { buildListener } from "@src/events/rr";

import * as read from "@src/events/files/read";
import * as write from "@src/events/files/write";
import config from "@src/config";


buildListener<read.RequestPayload, read.ResponsePayload>(
  read.ACTION_READ_FILE,
  async ({ path }) => {

    let payload: read.ResponsePayload;

    try {
      if (!path.startsWith('/')) {
        throw new Error(`The path ${path} doesn't start with '/'. `);
      }

      const absoultPath = join(config.engine.repositoryPath, path);
      const buffer = await readFile(absoultPath);
      const data = buffer.toString();

      payload = {
        data,
      }

      return [payload, null];
      
    } catch(error) {
      payload = {
        data: "",
      }
      return [payload, error];
    }
  }
);


buildListener<write.RequestPayload, write.ResponsePayload>(
  write.ACTION_WRITE_FILE,
  async ({ path, data }) => {
    const payload = {
      data: path,
    }
    return [payload, null];
  }
);
