import redis from "redis";

class RedisClient {

  _client: redis.RedisClient | null;

  constructor() {
    this._client = null;
  }

  get client() {
    if (this._client === null) {
      throw new Error("");
    }
    return this._client;
  }

  async connect() {
    this._client = redis.createClient({
      host: "localhost",
      port: 6379,
      db: 0,
    });

    return new Promise<void>((resolve, reject) => {
      this.client.on("ready", () => {
        resolve();
      });

      this.client.on("error", (error) => {
        console.error(error);
        reject(error);
      });
    });
  }

  get(key: string) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    })
  }

  set(key: string, value: string) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

}


export default RedisClient;
