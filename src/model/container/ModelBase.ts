import { readFile, writeFile, mkdir } from "fs/promises";

import YAML from 'yaml';
import { classToPlain } from "class-transformer";

import GitStoreAccessor from "@src/store/git/ModelGitAccssor";

import { ReturnPromiseType } from "@src/utils/generic";
import { calcHash } from "@src/utils/hash";
import { flatPromisify } from "@src/utils/tools";


abstract class ModelBase {

  protected static readonly instancePool: Map<string, { instance: any }> = new Map();

  // get commitHistory() {
  //   return flatPromisify<ReturnPromiseType<GitStoreCenter["history"]>>(async () => {
  //     const repository = await this.getRepository();
  //     const history = await repository.history(this.discriptionFilePath);
  //     return history;
  //   })();
  // }

  // get created_at() {
  //   return flatPromisify<Date>(async () => {
  //     const history = await this.commitHistory;
  //     return history[0].committedAt;
  //   })();
  // }

  // get updated_at() {
  //   return flatPromisify<Date>(async () => {
  //     const history = await this.commitHistory;
  //     return history[history.length - 1].committedAt;
  //   })();
  // }

  // async serialize() {
  //   return YAML.stringify(classToPlain(this, { excludeExtraneousValues: true }));
  // }

  // async dump() {
  //   await this.setDiscriptionFileContent(await this.serialize());
  // }

}


export default ModelBase;
