import "reflect-metadata";

import YAML from 'yaml';
import { validateOrReject } from "class-validator";
import { plainToClass } from "class-transformer";
import { Field, ObjectType } from "type-graphql";

import Section from "./Section";
import BaseProtoType from "./BaseProtoType";
import { calcHash } from "@src/utils";


@ObjectType({ implements: BaseProtoType })
class ProtoType extends BaseProtoType {

  private rawHash: string = "";

  constructor(
    name: string, 
    description: string, 
    sections: Section[], 
    // datasources: IDataSource[]
  ) {
    super();
    this.name = name;
    this.description = description;

    this.sections = sections;
    // this.datasources = datasources;
  }

  @Field(() => String)
  get hash() {
    return this.rawHash;
  }

  // get templateFunction() {
  //   return flatPromisify<AsyncTemplateFunction>(async () => {
  //     const content = await this.template;
  //     const hash = calcHash(content);

  //     if (hash !== this._template.hash) {
  //       this._template.func = compile(content, { async: true });
  //       this._template.hash = hash;
  //     }
      
  //     return this._template.func!;
  //   })();
  // }

  // get template() {
  //   return flatPromisify<string>(async () => {
  //     const buffer = await readFile(this.templatePath);
  //     return buffer.toString();
  //   })();
  // }

  // get controller() {
  //   return flatPromisify<string>(async () => {
  //     const buffer = await readFile(this.controllerPath);
  //     return buffer.toString();
  //   })();
  // }

  static async deserialize(name: string, strOrObject: string | object) {
    const rawObject = typeof strOrObject === "string" ? YAML.parse(strOrObject) : strOrObject;
    const strContent = YAML.stringify(rawObject);
    const hash = calcHash(strContent);

    const obj = plainToClass(ProtoType, rawObject, { excludeExtraneousValues: true }) as unknown as ProtoType;
    obj.name = name;
    obj.rawHash = hash;

    console.log(obj);
    console.log(obj.sections[0].fields);

    try {
      await validateOrReject(obj);
    } catch(error) {
      const errorMessage = `Try to validate the ProtoType object but failed at [${error}]. \nThe file content is: \n${strContent}`;
      throw new Error(errorMessage);
    }
    
    return obj;
  }

}


export default ProtoType;
