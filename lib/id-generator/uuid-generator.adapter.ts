import { IdGeneratorPort } from "./id-generator.port";
import { v7 as uuidV7 } from "uuid";

export const uuid7GeneratorAdapter: IdGeneratorPort = {
  generate: () => uuidV7(),
};
