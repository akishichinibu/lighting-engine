import "reflect-metadata";
import { dirname, join, basename } from "path";
import YAML from 'yaml';

import { IsDefined, Length, ValidateNested, validateOrReject } from "class-validator";
import { Expose, plainToClass, Type } from "class-transformer";
import { Field, ID, InterfaceType, ObjectType } from "type-graphql";

import { Dree, scanAsync } from "dree";
import ValueItem from "./ValueItem";

import ModelBase from "@src/model/container/ModelBase";
import config from "@src/config";
import { flatPromisify, randomHex } from "@src/utils";
import BaseContentDocument from "./BaseContentDocument";


export type FidleValueType = string | boolean | number;
export type FidleDataName = "string" | "boolean" | "int" | "float";


@ObjectType("ContentDocument", { implements: BaseContentDocument })
class ContentDocument extends BaseContentDocument {

  constructor(
    proto: string,
    data: ValueItem[],
  ) {
    super();
    this.id = randomHex(config.engine.contentTypeIdLength);
    this.proto = proto;
    this.data = data;
  }
  
  static async deserialize(contentPath: string, strOrObject: string | object) {
    const rawObject = typeof strOrObject === "string" ? YAML.parse(strOrObject) : strOrObject;
    const strContent = YAML.stringify(rawObject);
    
    const obj = plainToClass(ContentDocument, rawObject, { excludeExtraneousValues: true })  as unknown as ContentDocument;

    try {
      await validateOrReject(obj);
    } catch (error) {
      const errorMessage = `Try to validate the ContentDocument object but failed at [${error}]. \nThe file content is: \n${strContent}`;
      throw new Error(errorMessage);
    }

    return obj;
  }

  // async dump() {
  //   return await this.setDiscriptionFileContent(await this.serialize());
  // }
}


export default ContentDocument;
