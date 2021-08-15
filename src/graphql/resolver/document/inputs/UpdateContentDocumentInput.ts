import "reflect-metadata";
import { Field, InputType } from "type-graphql";
import { Length, ValidateNested } from "class-validator";

import UpdateValueItemInput from "./UpdateValueItemInput";


@InputType()
class UpdateContentDocumentInput {

  @Field(() => String)
  @Length(5, 255)
  proto!: string;

  @Field(() => [UpdateValueItemInput])
  @ValidateNested()
  data!: UpdateValueItemInput[];

}

export default UpdateContentDocumentInput;
