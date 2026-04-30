import { IdGeneratorPort } from "./id-generator.port";
import { uuidv7 } from "uuidv7";

export const uuid7GeneratorAdapter: IdGeneratorPort = {
  generate: () => uuidv7(),
};
