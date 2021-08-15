
import { dirname, join } from "path";
import util from "util";
import { writeFile, readFile } from "fs/promises";
import { execFile } from "child_process";

import { ENV_SANDBOX_INPUT_FILE, ENV_SANDBOX_OUTPUT_FILE } from "./env";
import { randomHex } from "@src/utils/hash";
import _logger from "@src/logger";


const logger = _logger.child({
  module: "sandbox",
});


interface SandboxTaskResult {
  executeId: string;
  output: any;
  error: string | null,
}


class SandboxTask {

  private static getCurrentNodeDir() {
    return dirname(process.env["_"]!);
  }

  private static tempPath = "/tmp";

  constructor(
    private readonly name: string, 
    private readonly script: string, 
    private readonly input: any,
  ) {}

  async eval(env: { [key: string]: string }={}): Promise<SandboxTaskResult> {
    const executeId = randomHex(32);

    // Prepare the execution environment
    const _t = SandboxTask.tempPath;
    const _path = join(_t, `${this.name}.js`);
    const _inputPath = join(_t, `${this.name}-${executeId}.in`);
    const _outputPath = join(_t, `${this.name}-${executeId}.out`);

    const dumpedInput = JSON.stringify(this.input);

    await Promise.all([
      writeFile(_path, this.script),
      writeFile(_inputPath, dumpedInput),
    ]);

    logger.info(`writed script(${this.script.length}) to [${_path}], writed input to [${_inputPath}]`);

    const task = () => util.promisify(execFile)("node", [_path, ], {
      cwd: _t,
      env: {
        "PATH": SandboxTask.getCurrentNodeDir(),
        [ENV_SANDBOX_INPUT_FILE]: _inputPath,
        [ENV_SANDBOX_OUTPUT_FILE]: _outputPath,
        ...env,
      },
    });

    let stdout, stderr;

    const wrappedTask = async () => {
      const t = new Date().getTime();

      const result = await task();

      const usedTimeMs = new Date().getTime() - t;
      logger.info(`executed the task [${this.name}](${executeId}) success within [${usedTimeMs}] ms. `);
      return result;
    }

    try {
      const result = await wrappedTask();
      stdout = result.stdout;
      stderr = result.stderr;
    } catch (error) {
      logger.error(error);
      return {
        executeId,
        output: null,
        error,
      }
    }

    logger.debug(`Execute the script with ID [${executeId}] with 
<stdout> 
${stdout} 

<stderr> 
${stderr}`);

    let outputObject;

    try {
      const output = await readFile(_outputPath);
      outputObject = JSON.parse(output.toString());
    } catch (error) {
      outputObject = null;
    }

    return {
      executeId,
      output: outputObject,
      error: null,
    }
  }

}


export default SandboxTask;
