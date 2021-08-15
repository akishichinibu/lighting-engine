import { dirname, join } from "path";
import { compile } from "ejs";
import { Dree, scanAsync } from "dree";

import config from "@src/config";

import BaseGitAccessor from "./BaseGitAccessor";

import ProtoType from "@src/model/container/prototype";
import ContentDocument from "@src/model/container/document";
import { readFile } from "fs/promises";


async function removeProps(root: Dree, ...targets: string[]): Promise<void> {
  for (let r of targets) {
    // @ts-ignore
    if (root[r]) delete root[r];
  }

  if (root.children) {
    for (let c of root.children) removeProps(c, ...targets);
  }
}


export async function createModelGitAccssor() {
  const accessor = await ModelGitAccssor.create(config.engine.repositoryPath);
  return accessor;
}


interface FileProperty {
  name: string;
  type: "document" | "directory" | "other";
  status: "modified" | "new" | "commited";
  sizeInBytes: number;
  children: Array<FileProperty> | null;
};


class ModelGitAccssor extends BaseGitAccessor {

  static override async create(root: string): Promise<ModelGitAccssor> {
    const inst = await super.create(root);
    return new ModelGitAccssor(inst.repository);
  }

  async loadProtoTypeFileHandler() {

  }


  async loadProtoTypeFromPath(path: string): Promise<ProtoType> {
    dirname
    const fn = join(path, "config.yaml");
    const content = await readFile(fn);

    const _parts = dirname(fn);
    const name = _parts[_parts.length - 1];
    const instance = await ProtoType.deserialize(name, content);

    return instance;
  }

  async loadProtoType(branch: string, name: string): Promise<ProtoType> {
    const fn = join(config.engine.protoTypeRootPath, name, "config.yaml");
    const content = await this.show(branch, fn);
    const instance = await ProtoType.deserialize(name, content);
    return instance;
  }

  async loadContentDocument(branch: string, fileName: string): Promise<ContentDocument> {
    const fn = join(config.engine.siteRootPath, fileName);
    console.log(fn);
    const content = await this.show(branch, fn);
    const instance = await ContentDocument.deserialize(fn, content);
    return instance;
  }

  
  async loadContentContext(protoType: ProtoType, contentDocument: ContentDocument) {
    const fieldNameMap = new Map(protoType.sections.flatMap(s => s.fields.map(fl => [fl.id, fl.name])));
    const model = Object.fromEntries(contentDocument.data.map(r => [fieldNameMap.get(r.id), r.value]));
    return model;
  }


  async loadProtoTypeController(branch: string, name: string) {
    const fn = join(config.engine.protoTypeRootPath, name, "controller.ts");
    const content = await this.show(branch, fn);
    return content;
  }

  async loadProtoTypeTemplate(branch: string, name: string) {
    const fn = join(config.engine.protoTypeRootPath, name, "template.ejs");
    const content = await this.show(branch, fn);
    return content;
  }

  async loadProtoTypeTemplateFunction(branch: string, name: string) {
    const content = await this.loadProtoTypeTemplate(branch, name);
    return compile(content, { async: true });
  }

  async getContentTree() {
    const currentBranch = await this.getCurrentBranch();
    const commit = await this.repository.getBranchCommit(currentBranch);
    const rootTree = await commit.getTree();

    const initRoot = "contents";

    const contentsEntry = await rootTree.getEntry(initRoot);
    const contentsTree = await contentsEntry.getTree();

    const parent: FileProperty = {
      name: initRoot,
      type: "directory",
      status: "commited",
      sizeInBytes: 0,
      children: [],
    }

    const stack = [
      { root: initRoot, tree: contentsTree, parentNode: parent },
    ];

    while (stack.length > 0) {
      const { root, tree, parentNode } = stack.shift()!;

      for (let c of tree.entries()) {
        const name = c.name();
        let node: FileProperty;

        if (c.isDirectory()) {
          const newRoot = join(root, name);
          const newTree = await c.getTree();

          node = {
            name,
            type: "directory",
            status: "commited",
            sizeInBytes: 0,
            children: [],
          }

          stack.push({ root: newRoot, tree: newTree, parentNode: node });

        } else {
          const blob = await c.getBlob();

          node = {
            name,
            type: name.endsWith(".yaml") ? "document" : "other",
            status: "commited",
            sizeInBytes: blob.rawsize(),
            children: null,
          }
        }

        parentNode.children!.push(node);
      }
    }

    return parent;
  }

  async getCommitedContentTree() {
    const currentBranch = await this.getCurrentBranch();
    const commit = await this.repository.getBranchCommit(currentBranch);
    const rootTree = await commit.getTree();

    const initRoot = "contents";

    const contentsEntry = await rootTree.getEntry(initRoot);
    const contentsTree = await contentsEntry.getTree();

    const parent: FileProperty = {
      name: initRoot,
      type: "directory",
      status: "commited",
      sizeInBytes: 0,
      children: [],
    }

    const stack = [
      { root: initRoot, tree: contentsTree, parentNode: parent },
    ];

    while (stack.length > 0) {
      const { root, tree, parentNode } = stack.shift()!;

      for (let c of tree.entries()) {
        const name = c.name();
        let node: FileProperty;

        if (c.isDirectory()) {
          const newRoot = join(root, name);
          const newTree = await c.getTree();

          node = {
            name,
            type: "directory",
            status: "commited",
            sizeInBytes: 0,
            children: [],
          }

          stack.push({ root: newRoot, tree: newTree, parentNode: node });

        } else {
          const blob = await c.getBlob();

          node = {
            name,
            type: name.endsWith(".yaml") ? "document" : "other",
            status: "commited",
            sizeInBytes: blob.rawsize(),
            children: null,
          }
        }

        parentNode.children!.push(node);
      }
    }

    return parent;
  }

}


export default createModelGitAccssor();
