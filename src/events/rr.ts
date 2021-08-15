import emitter, { RequestEvent, ResponseEvent } from "./emitter";
import { randomHex } from "@utils/hash";
import _logger from "@src/logger";


const logger = _logger.child({
  module: "rr",
});


const listenCenter = new Map<string, () => void>();


export function buildRequester<R, P>(actionName: string) {

  return (payload: R) => {

    if (!listenCenter.has(actionName)) {
      throw new Error(`The action ${actionName} hasn't been registered. `);
    }

    const messageId = randomHex(32);

    return new Promise<P>((resolve, reject) => {
      emitter.once(`${actionName}-response:${messageId}`, ({ payload, error }: ResponseEvent<P>) => {
        if (error) {
          reject(error);
        } else {
          resolve(payload!);
        }
      });
      const msg = {
        messageId,
        payload,
      }
      
      emitter.emit(`${actionName}-request`, msg);
      logger.info(`The request message ${messageId} which actionName is ${actionName} has been emmitted`);
    });
  }
}


type Handler<R, P> = (payload: R) => Promise<[P | null, any]>;


export function buildListener<R, P>(actionName: string, handler: Handler<R, P>) {

  if (listenCenter.has(actionName)) {
    throw new Error(`The action ${actionName} has more than one handler. `);
  }

  let listener = listenCenter.get(actionName);

  listener = () => {
    emitter.on(`${actionName}-request`, async (request: RequestEvent<R>) => {
      const { messageId, payload: _payload } = request;

      let response: ResponseEvent<P>;

      try {
        const [payload, error] = await handler(_payload);
        response = {
          payload,
          error,
        }
      } catch (error) {
        response = {
          payload: null,
          error,
        }
      }

      emitter.emit(`${actionName}-response:${messageId}`, response);
      logger.info(`The response message ${messageId} which actionName is ${actionName} has been emmitted`);
    });
  }

  listenCenter.set(actionName, listener);
  return listener;
}


export function registerListeners() {
  listenCenter.forEach((v, k) => {
    v();
    logger.info(`The listener ${k} has been reigistered. `);
  });
}
