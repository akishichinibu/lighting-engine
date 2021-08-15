import "reflect-metadata";
import { ValidateNested } from "class-validator";
import { InputType, Field, } from "type-graphql";

import UpdateSectionInput from "./UpdateSectionInput";


@InputType()
class UpdateProtoTypeInput {

  @Field({ nullable: true })
  description?: string;

  @Field(() => [UpdateSectionInput], { nullable: true })
  @ValidateNested()
  sections?: UpdateSectionInput[];

}


export default UpdateProtoTypeInput;
