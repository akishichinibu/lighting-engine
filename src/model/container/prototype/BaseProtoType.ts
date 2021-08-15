import "reflect-metadata";
import { IsDefined, MaxLength } from "class-validator";
import { Expose, Type } from "class-transformer";
import { Field, InterfaceType } from "type-graphql";

import ModelBase from "@model/container/ModelBase";
import Section from "./Section";


@InterfaceType("IProtoType")
abstract class BaseProtoType extends ModelBase {

  @Field(() => String)
  @Expose()
  @IsDefined()
  @MaxLength(255)
  name!: string;

  @Field(() => String)
  @Expose()
  @IsDefined()
  description!: string;

  @Field(() => [Section])
  @Expose()
  // @ValidateNested()
  @IsDefined()
  @Type(() => Section)
  sections!: Section[];

  // @Field(() => [DataSourceBase])
  // @Expose()
  // // @ValidateNested()
  // @IsDefined()
  // @Type(() => Section)
  // datasources!: IDataSource[];

}


export default BaseProtoType;
