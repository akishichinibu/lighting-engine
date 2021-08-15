
export type Voidable<T> = T | undefined;

export type Nullable<T> = T | null;

export type UnboxPromise<T extends Promise<any>> = T extends Promise<infer U> ? U: never;

export type AsyncCallable = (...args: any) => Promise<any>;

export type ReturnPromiseType<T extends AsyncCallable> = T extends (...args: any) => Promise<infer R> ? R : any;

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

export interface DirTree { 
  name: string;
  relativePath: string;
  type: "directory" | "file";
  sizeInBytes: string;
  hash: string;
  children: Array<DirTree>;
 };
