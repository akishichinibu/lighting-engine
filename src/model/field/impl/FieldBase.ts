import { Length, MaxLength } from "class-validator";
import { Expose } from "class-transformer";
import { Field, ID, ObjectType } from "type-graphql";

import { PropertySetting, PropertySettingInput } from "@src/model/PropertySetting";
import config from "@src/config";
import { randomHex } from "@src/utils";


@ObjectType("InputField")
abstract class FieldBase {

  @Field(() => String)
  @Expose()
  version: string="";

  @Field(() => ID)
  @Length(config.engine.fieldIdLength, config.engine.fieldIdLength)
  @Expose()
  id: string;

  @Field(() => String)
  @MaxLength(255)
  @Expose()
  name: string;

  @Expose()
  get type(): string {
    return "";
  }

  @Field(() => String)
  @Expose()
  description?: string;

  @Field(() => Boolean)
  @Expose()
  allowEdit: boolean;

  @Field(() => [PropertySettingInput])
  @Expose()
  properties: Array<PropertySettingInput> = [];
  
  protected abstract getPropertiesMetaInfo(): Array<PropertySetting>;

  constructor(
    name: string,
    description: string | undefined,
    allowEdit: boolean,
    properties: Array<PropertySettingInput>
  ) {
    this.id = randomHex(config.engine.fieldIdLength);
    this.name = name;
    this.description = description;
    this.allowEdit = allowEdit;

    if (properties) {
      const indexNameMap = new Map(this.getPropertiesMetaInfo().map(({ name }, index) => [name, index]));
      this.properties = new Array<PropertySetting>(indexNameMap.size);

      properties.forEach((r) => {
        const index = indexNameMap.get(r.name);

        if (index === undefined) {
          throw new Error(`The given field ${r.name} doesn't existed for field ${name}. `);
        }

        this.properties[index] = r;
      });
    }

    // this.nameToPropertiesIndex = new Map(this.properties.map(({ name }, i) => [name, i]));
  }
}


export default FieldBase;
