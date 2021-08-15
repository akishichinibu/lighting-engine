import { FileProperty } from "@src/utils/tools";

export const ACTION_FETCH_FILE_TREE = "fetch-file-tree";


export interface RequestPayload {
}


export interface ResponsePayload {
  tree: FileProperty;
}
