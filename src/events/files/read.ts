
export const ACTION_READ_FILE = "read-file";


export interface RequestPayload {
  path: string;
}


export interface ResponsePayload {
  data: string;
}
