import SandboxTask from "../src/sandbox/task";


test('test sandbox', async () => {
  
  const task = new SandboxTask("a", "console.log('hello'); ", {});
  const result = await task.eval();
  console.log(result);

});
