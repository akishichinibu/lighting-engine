import "reflect-metadata";
import { InputType, Field } from "type-graphql";


@InputType()
class UpdatePropertySettingInput {

  @Field()
  name!: string;

  @Field()
  value!: null | string;
}


export default UpdatePropertySettingInput;
