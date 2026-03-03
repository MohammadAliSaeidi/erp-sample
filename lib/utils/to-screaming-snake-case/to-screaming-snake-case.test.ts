import { toScreamingSnakeCase } from "./to-screaming-snake-case";

describe("toScreamingSnakeCase", () => {
	describe("edge cases", () => {
		it("returns empty string for empty input", () => {
			expect(toScreamingSnakeCase("")).toBe("");
		});

		it("handles single word", () => {
			expect(toScreamingSnakeCase("hello")).toBe("HELLO");
		});

		it("handles already screaming snake case", () => {
			expect(toScreamingSnakeCase("HELLO_WORLD")).toBe("HELLO_WORLD");
		});

		it("handles single character", () => {
			expect(toScreamingSnakeCase("a")).toBe("A");
		});

		it("handles all separators trimmed", () => {
			expect(toScreamingSnakeCase("__--..")).toBe("");
		});
	});

	describe("separator handling", () => {
		it("converts space-separated words", () => {
			expect(toScreamingSnakeCase("hello world")).toBe("HELLO_WORLD");
		});

		it("converts hyphen-separated words", () => {
			expect(toScreamingSnakeCase("hello-world")).toBe("HELLO_WORLD");
		});

		it("converts underscore-separated words", () => {
			expect(toScreamingSnakeCase("hello_world")).toBe("HELLO_WORLD");
		});

		it("converts dot-separated words", () => {
			expect(toScreamingSnakeCase("hello.world")).toBe("HELLO_WORLD");
		});

		it("converts slash-separated words", () => {
			expect(toScreamingSnakeCase("hello/world")).toBe("HELLO_WORLD");
		});

		it("converts backslash-separated words", () => {
			expect(toScreamingSnakeCase("hello\\world")).toBe("HELLO_WORLD");
		});

		it("collapses consecutive separators", () => {
			expect(toScreamingSnakeCase("hello___world")).toBe(
				"HELLO_WORLD",
			);
		});

		it("handles leading and trailing separators", () => {
			expect(toScreamingSnakeCase("__hello_world__")).toBe(
				"HELLO_WORLD",
			);
		});

		it("handles mixed separators", () => {
			expect(toScreamingSnakeCase("hello-_./world")).toBe(
				"HELLO_WORLD",
			);
		});
	});

	describe("camelCase and PascalCase input", () => {
		it("splits camelCase", () => {
			expect(toScreamingSnakeCase("helloWorld")).toBe("HELLO_WORLD");
		});

		it("splits PascalCase", () => {
			expect(toScreamingSnakeCase("HelloWorld")).toBe("HELLO_WORLD");
		});

		it("splits multi-word camelCase", () => {
			expect(toScreamingSnakeCase("myVariableName")).toBe(
				"MY_VARIABLE_NAME",
			);
		});

		it("handles consecutive capitals as acronym", () => {
			expect(toScreamingSnakeCase("parseHTTPRequest")).toBe(
				"PARSE_HTTP_REQUEST",
			);
		});

		it("handles acronym at start", () => {
			expect(toScreamingSnakeCase("HTTPSRequest")).toBe(
				"HTTPS_REQUEST",
			);
		});

		it("handles acronym at end", () => {
			expect(toScreamingSnakeCase("requestHTTPS")).toBe(
				"REQUEST_HTTPS",
			);
		});

		it("handles multiple acronyms", () => {
			expect(toScreamingSnakeCase("parseHTTPSAndFTPRequests")).toBe(
				"PARSE_HTTPS_AND_FTP_REQUESTS",
			);
		});
	});

	describe("numeric tokens", () => {
		it("splits letter-to-digit boundary", () => {
			expect(toScreamingSnakeCase("myVar2")).toBe("MY_VAR_2");
		});

		it("splits digit-to-letter boundary", () => {
			expect(toScreamingSnakeCase("v2Request")).toBe("V_2_REQUEST");
		});

		it("handles standalone number token", () => {
			expect(toScreamingSnakeCase("version 2 api")).toBe(
				"VERSION_2_API",
			);
		});

		it("handles number at start", () => {
			expect(toScreamingSnakeCase("123abc")).toBe("123_ABC");
		});

		it("handles version strings", () => {
			expect(toScreamingSnakeCase("my-var_v2")).toBe("MY_VAR_V_2");
		});
	});

	describe("real-world inputs", () => {
		it("handles API endpoint path", () => {
			expect(toScreamingSnakeCase("v2.endpoint/path")).toBe(
				"V_2_ENDPOINT_PATH",
			);
		});

		it("handles env variable style input", () => {
			expect(toScreamingSnakeCase("DATABASE_HOST_URL")).toBe(
				"DATABASE_HOST_URL",
			);
		});

		it("handles sentence-like input", () => {
			expect(toScreamingSnakeCase("the quick brown fox")).toBe(
				"THE_QUICK_BROWN_FOX",
			);
		});

		it("handles mixed case with separators", () => {
			expect(toScreamingSnakeCase("My-Var_name.here")).toBe(
				"MY_VAR_NAME_HERE",
			);
		});

		it("handles React component name", () => {
			expect(toScreamingSnakeCase("MyButtonComponent")).toBe(
				"MY_BUTTON_COMPONENT",
			);
		});
	});

	describe("unicode / accented characters", () => {
		it("handles accented lowercase letters", () => {
			expect(toScreamingSnakeCase("héllo wörld")).toBe("HÉLLO_WÖRLD");
		});
	});
});
