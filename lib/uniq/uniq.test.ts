import { uniq } from "./uniq";

describe("uniq", () => {
	it("returns an empty array when given an empty array", () => {
		const result = uniq([], (item) => String(item));

		expect(result).toEqual([]);
	});

	it("returns all items when every key is unique", () => {
		const users = [
			{ id: "1", name: "Alice" },
			{ id: "2", name: "Bob" },
			{ id: "3", name: "Charlie" },
		];

		const result = uniq(users, (user) => user.id);

		expect(result).toEqual(users);
	});

	it("removes items with duplicate keys", () => {
		const users = [
			{ id: "1", name: "Alice" },
			{ id: "2", name: "Bob" },
			{ id: "1", name: "Alice Updated" },
		];

		const result = uniq(users, (user) => user.id);

		expect(result).toEqual([
			{ id: "1", name: "Alice" },
			{ id: "2", name: "Bob" },
		]);
	});

	it("keeps the first item for each duplicated key", () => {
		const products = [
			{ sku: "A-1", price: 100 },
			{ sku: "A-1", price: 200 },
			{ sku: "A-1", price: 300 },
		];

		const result = uniq(products, (product) => product.sku);

		expect(result).toEqual([{ sku: "A-1", price: 100 }]);
	});

	it("preserves the original order of first occurrences", () => {
		const items = [
			{ category: "book", value: 1 },
			{ category: "movie", value: 2 },
			{ category: "music", value: 3 },
			{ category: "book", value: 4 },
			{ category: "movie", value: 5 },
		];

		const result = uniq(items, (item) => item.category);

		expect(result).toEqual([
			{ category: "book", value: 1 },
			{ category: "movie", value: 2 },
			{ category: "music", value: 3 },
		]);
	});

	it("does not mutate the original array", () => {
		const items = [
			{ id: "1", name: "Alice" },
			{ id: "1", name: "Alice Updated" },
		];

		const original = [...items];

		uniq(items, (item) => item.id);

		expect(items).toEqual(original);
	});

	it("returns a new array instance", () => {
		const items = [
			{ id: "1", name: "Alice" },
			{ id: "2", name: "Bob" },
		];

		const result = uniq(items, (item) => item.id);

		expect(result).not.toBe(items);
	});

	it("supports numeric keys", () => {
		const items = [
			{ id: 1, value: "first" },
			{ id: 2, value: "second" },
			{ id: 1, value: "duplicate" },
		];

		const result = uniq(items, (item) => item.id);

		expect(result).toEqual([
			{ id: 1, value: "first" },
			{ id: 2, value: "second" },
		]);
	});

	it("supports symbol keys", () => {
		const sharedSymbol = Symbol("shared");
		const uniqueSymbol = Symbol("unique");

		const items = [
			{ key: sharedSymbol, value: "first" },
			{ key: uniqueSymbol, value: "second" },
			{ key: sharedSymbol, value: "duplicate" },
		];

		const result = uniq(items, (item) => item.key);

		expect(result).toEqual([
			{ key: sharedSymbol, value: "first" },
			{ key: uniqueSymbol, value: "second" },
		]);
	});

	it("calls getKey exactly once for each item", () => {
		const items = [{ id: "1" }, { id: "2" }, { id: "1" }];

		const getKey = jest.fn((item: { id: string }) => item.id);

		uniq(items, getKey);

		expect(getKey).toHaveBeenCalledTimes(items.length);
	});
});
