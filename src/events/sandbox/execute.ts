
export const ACTION_SANDBOX_EXECUTE = "sandbox-execute";


export interface RequestPayload {
  name: string;
  script: string;
  input: any;
}


export interface ResponsePayload {
  executeId: string;
  output: any;
}
