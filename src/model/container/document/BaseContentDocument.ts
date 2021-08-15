import "reflect-metadata";

import { IsDefined, Length, ValidateNested } from "class-validator";
import { Expose, plainToClass, Type } from "class-transformer";
import { Field, ID, InterfaceType } from "type-graphql";

import ValueItem from "./ValueItem";
import ModelBase from "@src/model/container/ModelBase";


@InterfaceType("IContentModel")
abstract class BaseContentDocument extends ModelBase {

  @Field(() => ID)
  @Expose()
  @IsDefined()
  // @Length(CONFIG.CONTENT_TYPE_ID_LENGTH, CONFIG.CONTENT_TYPE_ID_LENGTH)
  id!: string;

  @Field(() => String)
  @Expose()
  @IsDefined() 
  @Length(5, 255)
  proto!: string;

  @Field(() => [ValueItem])
  @Type(() => ValueItem)
  @ValidateNested()
  @Expose()
  data!: ValueItem[];

}


export default BaseContentDocument;
