// @ts-ignore
import { before, after } from "__controller__";

import { readFile, writeFile } from "fs/promises";
import { ENV_SANDBOX_INPUT_FILE, ENV_SANDBOX_OUTPUT_FILE } from "../../../sandbox/env";


(async () => {

  const inputPath = process.env[ENV_SANDBOX_INPUT_FILE]!;
  const outputPath = process.env[ENV_SANDBOX_OUTPUT_FILE]!;
  
  const inputBuffer = await readFile(inputPath);
  const inputObject = inputBuffer && JSON.parse(inputBuffer.toString());

  const result = await before(inputObject);

  result && await writeFile(outputPath, JSON.stringify(result));
})();
