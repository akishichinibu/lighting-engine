import { PubSub } from 'graphql-subscriptions';

import { delay } from '@src/utils';
import { TOPIC_CONTENT_TREE_PUBLISH } from "../resolver/topics";
import { FileProperty } from '@utils/tools';


let lastestContentTree: FileProperty | null = null;


async function contentTreePublish(pubSub: PubSub) {
  while (true) {
    await pubSub.publish(TOPIC_CONTENT_TREE_PUBLISH, null);
    await delay(5000, null);
  }
}
