
export const ACTION_BUNDLE_BUILD = "bundle-build";


export interface RequestPayload {
  name: string;
  script: string;
  input: any;
}


export interface ResponsePayload {
  executeId: string;
  output: any;
}
