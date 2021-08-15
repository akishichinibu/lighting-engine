import { delay } from '@src/utils';
import pubSub from '@src/graphql/pubsub';


function buildPeriodicTask(name: string, delayMs: number, task: () => Promise<void>) {
  return async () => {
    while (true) {
      await task();
      await delay(delayMs, null);
    }
  }
}


export default buildPeriodicTask;
