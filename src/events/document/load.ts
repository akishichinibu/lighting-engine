import ContentDocument from "@src/model/container/document";

export const ACTION_LOAD_DOCUMENT = "load-document";


export interface RequestPayload {
  path: string;
}


export interface ResponsePayload {
  document: ContentDocument;
}
