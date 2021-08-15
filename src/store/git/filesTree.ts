
import * as tree from "@src/events/files/tree";
import config from "@src/config";

import { buildListener } from "@src/events/rr";
import { join } from "path";

import { scanAsync, ScanOptions } from "dree";
import { FileProperty } from "@src/utils/tools";
import { assert } from "console";


const scanOptions: ScanOptions = {
  stat: false,
  hash: false,
  sizeInBytes: true,
  size: true,
  normalize: true,
};


buildListener<tree.RequestPayload, tree.ResponsePayload>(
  tree.ACTION_FETCH_FILE_TREE,
  async () => {
    const contentsRoot = join(config.engine.repositoryPath, "contents");
    const tree = await scanAsync(contentsRoot, scanOptions);

    const parent: FileProperty = {
      name: tree.name,
      type: "directory",
      status: "commited",
      sizeInBytes: 0,
      children: [],
    }

    const stack = [{
      tree,
      node: parent,
    }];

    while (stack.length > 0) {
      const { tree, node } = stack.shift()!;
      node.children = [];

      assert(tree.type === "directory");

      if (tree.children) {
        for (let c of tree.children) {

          const name = c.name;
          let childNode: FileProperty;

          switch (tree.type) {
            case "directory": {
              childNode = {
                name,
                type: "directory",
                status: "commited",
                sizeInBytes: 0,
                children: [],
              }
              stack.push({
                tree: c,
                node: childNode,
              });
              break;
            }
            case "file": {
              childNode = {
                name,
                type: name.endsWith(".yaml") ? "document" : "other",
                status: "commited",
                sizeInBytes: c.sizeInBytes!,
                children: [],
              }
              break;
            }
            default: {
              throw new Error("");
            }
          }

          node.children.push(childNode);
        }
      }
    }

    const payload = {
      tree: parent,
    };

    return [payload, null];
  }
);
