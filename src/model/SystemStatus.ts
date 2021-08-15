import { Field } from "type-graphql";


class System {

  @Field()
  get version(): string {
    return "v1.0.0";
  }

}


export default System;
