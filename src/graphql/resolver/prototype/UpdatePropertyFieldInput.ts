import "reflect-metadata";
import { Length, MaxLength, ValidateNested } from "class-validator";
import { InputType, Field, ID } from "type-graphql";
import UpdatePropertySettingInput from "./UpdatePropertySettingInput";


@InputType()
class UpdatePropertyFieldInput {

  @Field(type => ID, { nullable: true })
  // @Length( .FIELD_ID_LENGTH, CONFIG.FIELD_ID_LENGTH)
  id?: string;

  @Field({ nullable: true })
  @MaxLength(255)
  name?: string;

  @Field({ nullable: true })
  @MaxLength(255)
  type?: string = "";

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  allowEdit?: boolean;

  @Field(() => [UpdatePropertySettingInput], { nullable: true })
  @ValidateNested()
  properties?: Array<UpdatePropertySettingInput> = [];

}


export default UpdatePropertyFieldInput;
