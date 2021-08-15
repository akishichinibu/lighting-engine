import "reflect-metadata";
import { IsDefined, Length, MaxLength, ValidateNested } from "class-validator";
import { Expose } from "class-transformer";
import { Field, ID, ObjectType } from "type-graphql";

import { randomHex } from "@src/utils";
import config from "@src/config";

import FieldBase from "@src/model/field/impl/FieldBase";


@ObjectType("Section")
class Section {

  @Field(() => ID)
  @Expose()
  @Length(config.engine.fieldIdLength, config.engine.fieldIdLength)
  @IsDefined()
  id: string;

  @Field(() => String)
  @Expose()
  @MaxLength(255)
  @IsDefined()
  name: string;

  @Field(() => [FieldBase])
  @Expose()
  @ValidateNested()
  fields: FieldBase[];

  constructor(name: string, fields: FieldBase[]) {
    this.id = randomHex(config.engine.sectionIdLength);
    this.name = name;
    this.fields = fields;
  }

}


export default Section;
