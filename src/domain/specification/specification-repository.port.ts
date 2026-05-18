import { CategoryId } from "@/src/domain/category/category-id";
import { StoreId } from "@/src/domain/store/store-id";
import { Specification } from "./specification.aggregate";

export interface ISpecificationRepositoryPort {
  create: (input: Specification) => Promise<Specification>;
  getList: (
    categoryId: CategoryId,
    storeId: StoreId,
  ) => Promise<Specification[]>;
}
