import { CategoryId } from "./category-id";
import { StoreId } from "../store/store-id";
import { Category } from "./aggregates/category.aggregate";

export interface CategoryRepositoryPort {
  getList: (storeId: StoreId) => Promise<Category.Aggregate[]>;

  getById: (
    categoryId: CategoryId,
    storeId: StoreId,
  ) => Promise<Category.Aggregate | null>;

  create: (
    category: Category.Aggregate,
    storeId: StoreId,
  ) => Promise<Category.Aggregate>;

  update: (
    category: Category.Aggregate,
    storeId: StoreId,
  ) => Promise<Category.Aggregate>;
}
