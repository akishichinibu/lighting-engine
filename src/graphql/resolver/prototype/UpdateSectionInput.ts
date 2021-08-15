import "reflect-metadata";
import { MaxLength, ValidateNested } from "class-validator";
import { InputType, Field, ID, } from "type-graphql";

import UpdatePropertyFieldInput from "./UpdatePropertyFieldInput";


@InputType()
class UpdateSectionInput {

  @Field(type => ID, { nullable: true })
  id!: string;

  @Field({ nullable: true })
  @MaxLength(255)
  name!: string;

  @Field(() => [UpdatePropertyFieldInput], { nullable: true })
  @ValidateNested()
  fields!: UpdatePropertyFieldInput[];

}


export default UpdateSectionInput;
