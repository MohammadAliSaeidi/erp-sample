export class InvalidCategoryIdError extends Error{
  constructor(categoryId: string) {
    super(`Invalid category id: ${categoryId}`);
  }
}