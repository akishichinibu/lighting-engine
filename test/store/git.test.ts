process.env["REPOSITORY_ROOT_PATH"] = "/home/wsl/lighting-cms/lighting-repo";

import "@store/git/filesTree";
import "@store/git/files";
import { buildRequester, registerListeners } from "@events/rr";
import * as fileTree from "@events/files/tree";
import * as read from "@events/files/read";


beforeAll(() => {
  registerListeners();
});


describe("file accessing test", () => {

  test('check the file tree', async () => {
    const loadFileTreeRequester = buildRequester<fileTree.RequestPayload, fileTree.ResponsePayload>(fileTree.ACTION_FETCH_FILE_TREE);
    const tree = await loadFileTreeRequester({});
    console.log(JSON.stringify(tree));
  });

  test('check the file reading', async () => {
    const readFileRequester = buildRequester<read.RequestPayload, read.ResponsePayload>(read.ACTION_READ_FILE);
    const tree = await readFileRequester({ path: "/contents/website/articles/a1.yaml" });
    console.log(JSON.stringify(tree));
  });

  test('check the file reading error', async () => {
    const readFileRequester = buildRequester<read.RequestPayload, read.ResponsePayload>(read.ACTION_READ_FILE);
    expect(async () => {
      const tree = await readFileRequester({ path: "contents/website/articles/a1.yaml" });
    }).toThrow();
  });
});



// test('check the file history can be get', async () => {
//   const fn = randomHex(16);
//   await execute(`echo 'hello' > ${fn}`);
//   await execute(`git add ${fn} && git commit -m 'test commit'`);
//   await delay(1500, null);
//   await execute(`echo ' world' >> ${fn}`);
//   await execute(`git add ${fn} && git commit -m 'test commit'`);
//   const hs = await gitRepo.history(fn);
//   console.log(hs);
// });


// test('check the folder history can be get', async () => {
//   const rp = randomHex(16);
//   const p = join(gitPath, rp);
//   await mkdir(p, { recursive: true });

//   const fn1 = join(p, randomHex(16));
//   await execute(`echo 'hello1' > ${fn1}`);
//   await execute(`git add ${fn1} && git commit -m 'test commit 1'`);

//   await delay(1500, null);

//   const fn2 = join(p, randomHex(16));
//   await execute(`echo 'hello2' > ${fn2}`);
//   await execute(`git add ${fn2} && git commit -m 'test commit 2'`);
//   console.log(await gitRepo.history(rp));
// });


// test('check the folder history2', async () => {
//   console.log(await gitRepo.history("100.yaml"));
// });


// test('check the git status can be get', async () => {
//   const rp = randomHex(16);
//   const p = join(gitPath, rp);
//   await mkdir(p, { recursive: true });

//   const fn1 = join(p, randomHex(16));
//   await execute(`echo 'hello1' > ${fn1}`);

//   const fn2 = join(p, randomHex(16));
//   await execute(`echo 'hello2' > ${fn2}`);

//   console.log(await gitRepo.status());
// });
