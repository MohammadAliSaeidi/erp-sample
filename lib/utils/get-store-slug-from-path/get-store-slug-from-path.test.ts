import { getStoreSlugFromPath } from "./get-store-slug-from-path";

describe("getStoreSlugFromPath", () => {
	const MOCK_STORE_NAME = "test-store";

	describe("valid paths — returns store slug", () => {
		describe("localhost", () => {
			test("without protocol", () => {
				expect(
					getStoreSlugFromPath(
						`localhost:5173/store/${MOCK_STORE_NAME}/login`,
					),
				).toBe(MOCK_STORE_NAME);
			});

			test("with http://", () => {
				expect(
					getStoreSlugFromPath(
						`http://localhost:5173/store/${MOCK_STORE_NAME}/login`,
					),
				).toBe(MOCK_STORE_NAME);
			});

			test("with https://", () => {
				expect(
					getStoreSlugFromPath(
						`https://localhost:5173/store/${MOCK_STORE_NAME}/login`,
					),
				).toBe(MOCK_STORE_NAME);
			});
		});

		describe("production URLs", () => {
			test("basic domain", () => {
				expect(
					getStoreSlugFromPath(
						`https://example.com/store/${MOCK_STORE_NAME}/products`,
					),
				).toBe(MOCK_STORE_NAME);
			});

			test("subdomain", () => {
				expect(
					getStoreSlugFromPath(
						`https://app.example.com/store/${MOCK_STORE_NAME}/checkout`,
					),
				).toBe(MOCK_STORE_NAME);
			});
		});

		describe("store slug character variations", () => {
			test("slug with hyphens", () => {
				expect(
					getStoreSlugFromPath(`/store/my-awesome-store/page`),
				).toBe("my-awesome-store");
			});

			test("slug with underscores", () => {
				expect(
					getStoreSlugFromPath(`/store/my_store_name/page`),
				).toBe("my_store_name");
			});

			test("slug with numbers", () => {
				expect(getStoreSlugFromPath(`/store/store123/page`)).toBe(
					"store123",
				);
			});

			test("slug with mixed characters", () => {
				expect(getStoreSlugFromPath(`/store/my-store_1/page`)).toBe(
					"my-store_1",
				);
			});

			test("single character slug", () => {
				expect(getStoreSlugFromPath(`/store/a/page`)).toBe("a");
			});
		});

		describe("different sub-pages", () => {
			test.each([
				["login", `/store/${MOCK_STORE_NAME}/login`],
				["products", `/store/${MOCK_STORE_NAME}/products`],
				["checkout", `/store/${MOCK_STORE_NAME}/checkout`],
				["nested path", `/store/${MOCK_STORE_NAME}/products/123`],
			])("%s", (_, path) => {
				expect(getStoreSlugFromPath(path)).toBe(MOCK_STORE_NAME);
			});
		});

		describe("returns first store slug when multiple /store/ segments exist", () => {
			test("two store paths in URL", () => {
				expect(
					getStoreSlugFromPath(
						`/store/first-store/page/store/second-store/page`,
					),
				).toBe("first-store");
			});
		});
	});

	describe("invalid paths — returns null", () => {
		test("empty string", () => {
			expect(getStoreSlugFromPath("")).toBeNull();
		});

		test("no /store/ segment", () => {
			expect(getStoreSlugFromPath("/products/shoes")).toBeNull();
		});

		test("/store/ with no trailing slash (missing sub-page)", () => {
			expect(
				getStoreSlugFromPath(`/store/${MOCK_STORE_NAME}`),
			).toBeNull();
		});

		test("/store/ segment only", () => {
			expect(getStoreSlugFromPath("/store/")).toBeNull();
		});

		test("store in query param", () => {
			expect(
				getStoreSlugFromPath(`/products?store=${MOCK_STORE_NAME}`),
			).toBeNull();
		});

		test("store in hash", () => {
			expect(
				getStoreSlugFromPath(
					`/products#store/${MOCK_STORE_NAME}/page`,
				),
			).toBeNull();
		});

		test("slug with invalid characters (uppercase letters are valid, special chars are not)", () => {
			expect(getStoreSlugFromPath("/store/my store/page")).toBeNull(); // space
			expect(getStoreSlugFromPath("/store/my@store/page")).toBeNull(); // @
		});
	});
});
