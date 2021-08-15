process.env["REPOSITORY_ROOT_PATH"] = "/home/wsl/lighting-cms/lighting-repo";

import ProtoType from "@model/container/prototype";
import ControllerBundleBuilder from "@src/render/compile/bundlePacker";

import { randomHex } from "@src/utils";



const protoDoc = `
description: happy
sections:
  - id: abcdef123456
    name: a
    fields:
      - id: abcdef
        name: f1
        description: f1
        type: input
        properties:
          - name: defaultValue
            dtype: string
            value: abcdef
          - name: maxLength
            dtype: integer
            value: "100"
          - name: minLength
            dtype: integer
            value: "0"
      - id: opqrst
        name: f2
        description: f2
        type: checkbox
        properties:
          - name: defaultValue
            dtype: boolean
            value: "false"
datasources:
  - id: abcdef789012
    name: d1
    fields: null
`;

// test('prototype parse', async () => {
//   const protoName = randomHex(16);
//   const obj = await ProtoType.deserialize(protoName, protoDoc);

//   expect(obj.name).toBe(protoName);

//   new ControllerBundleBuilder()
// });
