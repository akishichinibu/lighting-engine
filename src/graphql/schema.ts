import { buildSchemaSync } from "type-graphql";

import ContentDocumentResolver from "./resolver/document";
import ProtoTypeResolver from "./resolver/prototype";
import SystemResolver from "./resolver/SystemStatusResolver";

import pubSub from "./pubsub";


const schema = buildSchemaSync({
  resolvers: [
    ProtoTypeResolver, 
    ContentDocumentResolver,
    SystemResolver,
  ],
  pubSub,
  dateScalarMode: "isoDate",
  validate: true,
  emitSchemaFile: {
    // path: join(__dirname, "schema.gql"),
    commentDescriptions: true,
    sortedSchema: false,
  },
});


export default schema;
