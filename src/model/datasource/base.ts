// import { Length, MaxLength } from "class-validator";
// import { Field, ID, InterfaceType } from "type-graphql";

// import { PropertySettingInput } from "../PropertySetting";

// import { JSONSchema7 } from "json-schema";
// import Configuration from "@src/config";


// @InterfaceType()
// export abstract class DataSourceBase<T> {

//   static outputSchema: JSONSchema7 = {};

//   @Field(type => ID)
//   @Length(Configuration.FIELD_ID_LENGTH, Configuration.FIELD_ID_LENGTH)
//   id!: string;

//   @Field(() => String)
//   @MaxLength(255)
//   name!: string;

//   @Field(() => String)
//   description!: string;

//   @Field(() => String)
//   @MaxLength(255)
//   type!: "";

//   properties: Array<PropertySettingInput> = [];

//   abstract pull(): T;
// }


// export abstract class DataSourcePropertiesBase {

// }
