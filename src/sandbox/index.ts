import emitter from "@src/events/emitter";
import { buildListener } from "@src/events/rr";
import * as execute from "@src/events/sandbox/execute";

import SandboxTask from "./task";


buildListener<execute.RequestPayload, execute.ResponsePayload>(
  execute.ACTION_SANDBOX_EXECUTE,
  async ({ name, script, input }) => {
    const task = new SandboxTask(name, script, input);
    const { output, error } = await task.eval();
    return [output, error];
  }
);
