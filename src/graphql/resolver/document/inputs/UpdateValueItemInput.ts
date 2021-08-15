import "reflect-metadata";
import { Field, InputType } from "type-graphql";
import { IsDefined } from "class-validator";


@InputType()
class UpdateValueItemInput {

  @Field(() => String)
  @IsDefined()
  id!: string;

  @Field(() => String)
  @IsDefined()
  dtype!: String;

  @Field(() => String)
  @IsDefined()
  value!: String;

}


export default UpdateValueItemInput;
