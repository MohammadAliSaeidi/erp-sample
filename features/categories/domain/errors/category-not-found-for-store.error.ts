export class CategoryNotFoundForStoreError extends Error {
	constructor(categoryId: string) {
		super(`Category ${categoryId} Not Found For Store`);
	}
}
