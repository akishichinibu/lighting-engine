// import { ObjectType } from "type-graphql";
// import { DataSourcePropertiesBase, DataSourceBase } from "./base";

// import { JSONSchema7 } from "json-schema";


// @ObjectType()
// class IStaticKeyPairDataSourceProperties extends DataSourcePropertiesBase {

//   choices!: Map<string, string>;

// }


// @ObjectType({ implements: DataSourceBase })
// class DStaticKeyPairDataSource extends DataSourceBase {

//   static outputSchema: JSONSchema7 = {
//     type: "array",
//     items: [
//       {
//         type: "object",
//         additionalProperties: false,
//         properties: {
//           key: {
//             type: "string",
//           },
//           value: {
//             type: "string",
//           },
//         }
//       }
//     ]
//   }


// };


// export default DStaticKeyPairDataSource;
