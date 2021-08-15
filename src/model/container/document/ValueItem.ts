import "reflect-metadata";
import { IsDefined, IsString } from "class-validator";
import { Expose } from "class-transformer";
import { Field, InputType, ObjectType } from "type-graphql";


@InputType()
@ObjectType("ValueItem")
class ValueItem {

  @Field()
  @IsString() @IsDefined()
  @Expose()
  id: string;

  @Field()
  @IsString() @IsDefined()
  @Expose()
  dtype: string;

  @Field()
  @IsString() @IsDefined()
  @Expose()
  value: string;

  constructor(id: string, dtype: string, value: string) {
    this.id = id;
    this.dtype = dtype;
    this.value = value;
  }

}


export default ValueItem;
