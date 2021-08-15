import ts from "typescript";
import { Configuration } from 'webpack';

import path from "path";
import _ from "lodash";


function getCompileOptionsJSONFollowExtends(baseDir: string, filename: string): {[key: string]: any} {
  let compopts: ts.CompilerOptions = {};
  const config = ts.readConfigFile(filename, ts.sys.readFile).config;
  if (config.extends) {
    const fn = _.endsWith(config.extends, ".json") ? config.extends : config.extends + ".json";
    const rqrpath = path.resolve(baseDir, fn);
    compopts = getCompileOptionsJSONFollowExtends(baseDir, rqrpath);
  }
  compopts = {
    ...compopts,
    ...config.compilerOptions,
  };
  return compopts;
}


export function fullfillAliasConfig(baseDir: string, config: Configuration, tscPath: string="tsconfig.json") {
  const tsConfig = getCompileOptionsJSONFollowExtends(baseDir, path.join(baseDir, tscPath));
  const _alias = tsConfig.paths || {};
  const cwd = process.cwd();
  const removeMatcher = (s: string) => _.trimEnd(_.trimEnd(s, "/**"), "/*");

  const alias = Object.fromEntries(Object.entries(_alias).flatMap(([key, value]) => {
    value = value || [];
    return (value as string[]).map(v => [removeMatcher(key as string), removeMatcher(path.resolve(cwd, v))]);
  }));

  if (!config.resolve) {
    config.resolve = {
      alias: {}
    };
  }

  config.resolve.alias = Object.assign(config.resolve.alias || {}, alias);
}
