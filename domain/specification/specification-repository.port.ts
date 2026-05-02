import { CategoryId, StoreId } from "@/features/shared/domain/ids";
import { Specification } from "./specification.aggregate";

export interface ISpecificationRepositoryPort {
  create: (input: Specification) => Promise<Specification>;
  getList: (categoryId: CategoryId, storeId: StoreId) => Promise<Specification[]>;
}
