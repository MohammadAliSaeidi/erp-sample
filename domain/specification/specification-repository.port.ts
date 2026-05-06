import { CategoryId } from "@/domain/category/category-id";
import { StoreId } from "@/domain/store/store-id";
import { Specification } from "./specification.aggregate";

export interface ISpecificationRepositoryPort {
  create: (input: Specification) => Promise<Specification>;
  getList: (
    categoryId: CategoryId,
    storeId: StoreId,
  ) => Promise<Specification[]>;
}
