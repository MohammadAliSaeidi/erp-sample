import { convertToScreamingSnakeCase } from "./convertToScreamingSnakeCase";

test("a new test", () => {
	expect(convertToScreamingSnakeCase("Hello world   this is a test2 3 ")).toBe(
		"HELLO_WORLD_THIS_IS_A_TEST2_3",
	);
});
