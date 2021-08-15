import "reflect-metadata";
import { Type } from "class-transformer";

class EngineConfiguration {

  repositoryPath!: string;

  get contentRootPath(): string {
    return `contents/`;
  }

  get siteRootPath(): string {
    return `${this.contentRootPath}/website/`;
  }

  get protoTypeRootPath(): string {
    return `prototype/`;
  }

  readonly indexFileName!: string;
  readonly configFileName!: string;
  readonly controllerFileName!: string;
  readonly templateFileName!: string;

  readonly contentTypeIdLength: number = 32;
  readonly sectionIdLength: number = 12;
  readonly fieldIdLength: number = 8;

}


class PortConfiguration {
  
  readonly previewEndpoint: number = 3000;
  readonly controllerEndpoint: number = 3001;
  readonly graphqlEndpoint: number = 5000;

}


class LightingConfiguration {

  @Type(() => EngineConfiguration)
  readonly engine!: EngineConfiguration;

  @Type(() => PortConfiguration)
  readonly port!: PortConfiguration;

}


export default LightingConfiguration;
