import ProtoType from "@src/model/container/prototype";

export const ACTION_LOAD_PROTOTYPE = "load-prototype";


export interface RequestPayload {
  name: string;
}


export interface ResponsePayload {
  protoType: ProtoType;
  template: string;
  controllerScript: string;
}
