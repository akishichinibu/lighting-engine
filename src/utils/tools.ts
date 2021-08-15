import { stat } from "fs/promises";


export const e = (key: string, default_?: string, throw_: boolean = false) => {
  const v = process.env[key] || default_;
  if (v) {
    return v;
  } else {
    if (throw_) {
      throw new Error(`Can not get the config field [${key}]`);
    }
  }
}


export async function exists(fn: string): Promise<boolean> {
  try {
    await stat(fn);
    return true;
  } catch (error) {
    return false;
  }
}


export function flatPromisify<T>(func: () => Promise<T>): () => Promise<T> {
  return async () => {
    let result: T;

    try {
      result = await func();
    } catch(error) {
      throw error;
    }

    return result;
  }
}


export function delay<T>(millis: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), millis))
}


export interface FileProperty {
  name: string;
  type: "document" | "directory" | "other";
  status: "modified" | "new" | "commited";
  sizeInBytes: number;
  children: Array<FileProperty>;
};
