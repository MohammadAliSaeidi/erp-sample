import { Category } from "./category.entity";

export interface ICategoryRepositoryPort {
  getList: (storeId: string) => Promise<Category[]>;
  getById: (categoryId: string, storeId: string) => Promise<Category | null>;
  create: (category: Category, storeId: string) => Promise<Category>;
  update: (category: Category, storeId: string) => Promise<Category>;
}
