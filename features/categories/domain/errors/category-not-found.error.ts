export class CategoryNotFoundError extends Error {
  constructor(categoryId: string) {
    super(`Category ${categoryId} not found`);
  }
}
