import { Specification } from "./specification.aggregate";

export interface ISpecificationRepositoryPort {
  create: (input: Specification, storeId: string) => Promise<Specification>;
}
