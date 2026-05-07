import { CategoryId } from "./category-id";
import { Category } from "./category.entity";
import { StoreId } from "../store/store-id";

export interface ICategoryRepositoryPort {
  getList: (storeId: StoreId) => Promise<Category[]>;
  getById: (
    categoryId: CategoryId,
    storeId: StoreId,
  ) => Promise<Category | null>;
  create: (category: Category, storeId: StoreId) => Promise<Category>;
  update: (category: Category, storeId: StoreId) => Promise<Category>;
}
