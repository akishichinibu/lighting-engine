import { resolve, join } from "path";
import { copyFile, writeFile, rm, mkdir } from "fs/promises";
import { Configuration, webpack, Stats } from "webpack";
import { createFsFromVolume, Volume } from "memfs";

import { calcHash, randomHex } from "@utils/hash";
import _logger from "@src/logger";
import ProtoType from "@src/model/container/prototype";

import _accessor from "@src/store/git/ModelGitAccssor";


const logger = _logger.child({
  module: "bundleBuilder",
});


interface CompileInfo {
  // script: string;
  // scriptHash: string;

  bundle: string;
  bundleHash: string;
}


interface CompileOption {
  context?: string;
  modules?: Array<string>;
  alias?: { [key: string]: string };
  externalFiles?: { [key: string]: string };
}


class ControllerBundleBuilder {

  private static compileCache: Map<string, CompileInfo> = new Map();

  static async create(protoTypeUri: string) {
    const accessor = await _accessor;
    const protoType = await accessor.loadProtoTypeFromPath(protoTypeUri);
    return new ControllerBundleBuilder(protoTypeUri, protoType);
  }

  constructor(
    private protoTypeUri: string,
    private protoType: ProtoType,
  ) {}

  async compile(options: CompileOption) {
    const name = this.protoType.name;
    logger.info(`to compile the controller of protoType [${name}]. `);

    const { bundle, hash: bundleHash } = await this._compile(options);

    const info = {
      // scriptHash: this.scriptHash,
      // script: this.script,
      bundle,
      bundleHash,
    };

    ControllerBundleBuilder.compileCache.set(name, info);
    return info;
  }

  private async _compile(options: CompileOption) {
    const compileRootPath = `/tmp/${randomHex(32)}`;

    // const inputFileName = `${this.name}.in.ts`;
    // const inputFilePath = join(compileRootPath, inputFileName);
    const outputFileName = `${this.protoType.name}.js`;

    const compileEnvironmentPath = resolve(__dirname, "..", "compile", "env");

    const config: Configuration = {
      mode: "development",
      target: 'node',
      context: options.context,
      entry: resolve(compileEnvironmentPath, "entry.ts"),
      output: {
        path: compileRootPath,
        filename: outputFileName,
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: "ts-loader",
            options: {
              configFile: resolve(compileEnvironmentPath, "tsconfig.json"),
            },
          }
        ],
      },
      resolve: {
        descriptionFiles: [
          join(compileEnvironmentPath, "package.json"),
        ],
        extensions: [".ts", ".js"],
        alias: {
          "__controller__": this.protoTypeUri,
          // "lighting-sandbox/src/common": require.resolve("lighting-sandbox/src/common"),
          ...(options.alias || {}),
        },
        modules: [
          resolve(this.protoTypeUri),
          join(compileEnvironmentPath, "node_modules"),
          ...(options.modules || []),
        ],
      },
      experiments: {
        topLevelAwait: true,
      },
    };

    const fsInMemory = createFsFromVolume(new Volume());

    const createCompileTask = () => new Promise<Stats>((resolve, reject) => {
      const compiler = webpack(config);
      logger.info(`create a compiler instance with config ${JSON.stringify(config, null, 4)}`);
      compiler.outputFileSystem = fsInMemory;

      compiler.run((err, stats) => {
        if (err || stats?.hasErrors()) {
          const _stats = stats?.toJson();
          logger.error(JSON.stringify(_stats?.errors, null, 4));
          reject(err);
        } else {
          resolve(stats!);
        }
      });
    });

    let compileResult, t;

    try {
      t = new Date().getTime();
      await mkdir(compileRootPath, { recursive: true });

      // const externalFiles = options.externalFiles || {};

      compileResult = await createCompileTask();

    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      // await rm(compileRootPath, { recursive: true });
    }

    const outputFilePath = join(compileRootPath, outputFileName);

    const bundle = await fsInMemory.readFileSync(outputFilePath).toString();
    const bundleHash = compileResult.hash!;

    const usedTimeMs = new Date().getTime() - t;
    logger.info(`generated a bundle with hash [${bundleHash}], size [${bundle.length}] within [${usedTimeMs}] ms success. `)

    return {
      bundle,
      hash: bundleHash,
    };
  }

}


export default ControllerBundleBuilder;
