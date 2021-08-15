import { Field, ObjectType } from "type-graphql";

export type FieldValueDtype = "string" | "integer" | "float" | "boolean" | "regex" | "schema";


@ObjectType()
export class PropertySettingInput {

  /* 
    The name of the setting field. It must be unique for a certain field. 
  */
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  value!: null | string;

}


@ObjectType({ implements: PropertySettingInput })
export class PropertySetting extends PropertySettingInput {

  @Field(() => String)
  dtype!: FieldValueDtype;

}
