import { readFileSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';
import { e } from './utils';

import LightingConfiguration from './utils/Configuration';
import { plainToClass } from 'class-transformer';

const repoitoryRoot = e("REPOSITORY_ROOT_PATH", undefined, true)!;
const configFilePath = join(repoitoryRoot, "config.yaml");

const configContent = readFileSync(configFilePath).toString();
const config = plainToClass(LightingConfiguration, YAML.parse(configContent));

config.engine.repositoryPath = repoitoryRoot;
export default config;
