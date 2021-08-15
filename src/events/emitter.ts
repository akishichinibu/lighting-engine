import { EventEmitter } from "events";
const emitter = new EventEmitter();

export default emitter;


export interface RequestEvent<P={}> {
  messageId: string;
  payload: P;
}


export interface ResponseEvent<P={}> {
  payload: P | null;
  error: string | null;
}
