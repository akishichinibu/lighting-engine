import "reflect-metadata";
import { join, dirname, basename } from "path";
import { Dree } from "dree";

import { Resolver, Query, Arg, Subscription, FieldResolver, Root, Mutation } from "type-graphql";
import GraphQLJSON from 'graphql-type-json';


import { TOPIC_CONTENT_DOCUMENT_PUBLISH, TOPIC_CONTENT_TREE_PUBLISH } from "../topics";
import ContentDocument from "@model/container/document";
import { buildRequester } from "@events/rr";

import * as load from "@events/document/load";
import * as fileTree from "@events/files/tree";


let contentTreeCache: Dree | null = null;


const loadModelRequester = buildRequester<load.RequestPayload, load.ResponsePayload>(load.ACTION_LOAD_DOCUMENT);


const loadFileTreeRequester = buildRequester<fileTree.RequestPayload, fileTree.ResponsePayload>(fileTree.ACTION_FETCH_FILE_TREE);


@Resolver(ContentDocument)
class ContentDocumentResolver   {

  @Query(() => GraphQLJSON)
  async contentTree() {
    const { tree } = await loadFileTreeRequester({});
    return tree;
  }

  @Subscription(() => GraphQLJSON, {
    topics: [
      TOPIC_CONTENT_TREE_PUBLISH,
    ],
  })
  async contentTreeNotification() {
    return await this.contentTree();
  }

  @Query(() => ContentDocument)
  async contentDocument(@Arg("uri") uri: string) {
    const path = join(dirname(uri), `${basename(uri)}.yaml`);
    const { document } = await loadModelRequester({ path })
    return document;
  }

  @FieldResolver(() => Date)
  async created_at(@Root() contentDocument: ContentDocument) {
    return new Date();
  }

  @FieldResolver(() => Date)
  async updated_at(@Root() contentDocument: ContentDocument) {
    return new Date();
  }

  @Subscription(() => ContentDocument, {
    topics: ({ args }) => `${TOPIC_CONTENT_DOCUMENT_PUBLISH}-${args.uri}`,
  })
  async contentDocumentNotification(@Arg("uri") uri: string) {
    return await this.contentDocument(uri);
  }

    // @Mutation(() => String, {

  // })
  // async updateContentDocument(
  //   @Arg("uri", () => String) uri: string,
  //   @Arg("content", () => UpdateContentDocumentInput) content: UpdateContentDocumentInput,
  // ) {
  //   console.log(content);
  //   const newContentDocument = new ContentDocument(content.proto, content.data, uri);
  //   newContentDocument.dump();
  //   pubSub.publish(`${TOPIC_CONTENT_DOCUMENT_PUBLISH}-${uri}`, newContentDocument);
  //   return newContentDocument.id;
  // }

}


export default ContentDocumentResolver;
