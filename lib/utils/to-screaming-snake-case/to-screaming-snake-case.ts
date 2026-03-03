/**
 * Tokenizes a string by splitting it into meaningful word components.
 *
 * The function processes the input through a series of regex replacements
 * to handle different word boundary cases:
 *
 * 1. Separator characters → spaces
 * 2. camelCase boundaries → spaces
 * 3. Acronym boundaries → spaces
 * 4. Number-to-letter boundaries → spaces
 * 5. Letter-to-number boundaries → spaces
 *
 * After processing, the string is trimmed, split on whitespace, and filtered
 * to remove any empty tokens.
 *
 * @param {string} input - The string to be tokenized
 * @returns {string[]} An array of string tokens with all empty strings filtered out
 *
 * @example
 * // Basic cases
 * tokenize("helloWorld"); // returns ["hello", "World"]
 * tokenize("HelloWorld"); // returns ["Hello", "World"]
 * tokenize("hello-world"); // returns ["hello", "world"]
 *
 * @example
 * // Acronym handling
 * tokenize("parseHTTPRequest"); // returns ["parse", "HTTP", "Request"]
 * tokenize("HTTPSRequest"); // returns ["HTTPS", "Request"]
 * tokenize("parseHTTPSAndFTPRequests"); // returns ["parse", "HTTPS", "And", "FTP", "Requests"]
 *
 * @example
 * // Numeric boundaries
 * tokenize("myVar2"); // returns ["my", "Var", "2"]
 * tokenize("v2Request"); // returns ["v", "2", "Request"]
 * tokenize("123abc"); // returns ["123", "abc"]
 *
 * @example
 * // Mixed separators
 * tokenize("My-Var_name.here"); // returns ["My", "Var", "name", "here"]
 * tokenize("hello-_./world"); // returns ["hello", "world"]
 * tokenize("v2.endpoint/path"); // returns ["v", "2", "endpoint", "path"]
 *
 * @example
 * // Edge cases
 * tokenize("__--.."); // returns []
 * tokenize("a"); // returns ["a"]
 * tokenize(""); // returns []
 *
 * @example
 * // Unicode support
 * tokenize("héllo wörld"); // returns ["héllo", "wörld"]
 */
function tokenize(input: string): string[] {
	return (
		input
			/**
			 * Detects and normalizes separator characters
			 *
			 * Pattern: /[\s\-_./\\|]+/g
			 * - \s : any whitespace character (space, tab, newline)
			 * \-  : hyphen/dash
			 * _   : underscore
			 * .   : dot/period
			 * /   : forward slash
			 * \\  : backslash
			 * |   : pipe
			 * +   : one or more occurrences
			 *
			 * Replaces any sequence of these characters with a single space.
			 *
			 * @example
			 * "hello world" → "hello world"
			 * "hello-world" → "hello world"
			 * "hello_world" → "hello world"
			 * "hello.world" → "hello world"
			 * "hello/world" → "hello world"
			 * "hello\\world" → "hello world"
			 * "hello|world" → "hello world"
			 * "hello-_./world" → "hello world"
			 * "hello___world" → "hello world"
			 * "__hello_world__" → " hello world "
			 */
			.replace(/[\s\-_./\\|]+/g, " ")

			/**
			 * Detects camelCase boundaries: lowercase letter or digit followed by uppercase letter
			 *
			 * Pattern: /([a-z\d])([A-Z])/g
			 * - ([a-z\d]) : capture group 1: any lowercase letter or digit
			 * - ([A-Z])   : capture group 2: any uppercase letter
			 *
			 * Inserts a space between group 1 and group 2.
			 * This handles standard camelCase transitions.
			 *
			 * @example
			 * "helloWorld" → "hello World"
			 * "myVariableName" → "my Variable Name"
			 * "v2Request" → "v2 Request" (note: digits handled here)
			 * "parseHTTPRequest" → "parse HTTPRequest" (partial)
			 */
			.replace(/([a-z\d])([A-Z])/g, "$1 $2")

			/**
			 * Detects acronym boundaries: sequence of uppercase letters followed by uppercase letter and lowercase
			 *
			 * Pattern: /([A-Z]+)([A-Z][a-z])/g
			 * - ([A-Z]+)     : capture group 1: one or more consecutive uppercase letters
			 * - ([A-Z][a-z]) : capture group 2: uppercase letter followed by lowercase letter
			 *
			 * Inserts a space between the acronym and the following word.
			 * This correctly handles cases like "HTTPRequest" → "HTTP Request"
			 *
			 * @example
			 * "HTTPRequest" → "HTTP Request"
			 * "HTTPSRequest" → "HTTPS Request"
			 * "XMLHttpRequest" → "XML HttpRequest" (partial)
			 * "parseHTTPRequest" → "parse HTTP Request" (after first replace)
			 * "parseHTTPSAndFTPRequests" → "parse HTTPS And FTP Requests" (with multiple acronyms)
			 */
			.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")

			/**
			 * Detects number-to-letter boundaries: digits followed by letters
			 *
			 * Pattern: /(\d+)([A-Za-z])/g
			 * - (\d+)       : capture group 1: one or more digits
			 * - ([A-Za-z])  : capture group 2: any letter (uppercase or lowercase)
			 *
			 * Inserts a space between digits and following letters.
			 * This ensures numbers are separated from adjacent text.
			 *
			 * @example
			 * "v2Request" → "v2 Request" (after previous replaces)
			 * "123abc" → "123 abc"
			 * "version2api" → "version2 api" (after first replace)
			 * "v2.endpoint/path" → "v2. endpoint/path" (partial)
			 */
			.replace(/(\d+)([A-Za-z])/g, "$1 $2")

			/**
			 * Detects letter-to-number boundaries: letters followed by digits
			 *
			 * Pattern: /([A-Za-z])(\d+)/g
			 * - ([A-Za-z])  : capture group 1: any letter (uppercase or lowercase)
			 * - (\d+)       : capture group 2: one or more digits
			 *
			 * Inserts a space between letters and following digits.
			 * This ensures text is separated from trailing numbers.
			 *
			 * @example
			 * "myVar2" → "myVar 2"
			 * "hello123world" → "hello 123world" (partial)
			 * "version2" → "version 2"
			 * "endpoint123" → "endpoint 123"
			 */
			.replace(/([A-Za-z])(\d+)/g, "$1 $2")

			/**
			 * Removes leading and trailing whitespace
			 *
			 * @example
			 * "  hello world  " → "hello world"
			 * " hello " → "hello"
			 */
			.trim()

			/**
			 * Splits the string on any sequence of whitespace characters
			 *
			 * Pattern: /\s+/
			 * Matches one or more whitespace characters and splits on them.
			 *
			 * @example
			 * "hello world" → ["hello", "world"]
			 * "hello   world" → ["hello", "world"]
			 */
			.split(/\s+/)

			/**
			 * Filters out any empty strings from the array
			 *
			 * Boolean constructor acts as a predicate that returns:
			 * - false for falsy values: "", 0, null, undefined, false, NaN
			 * - true for truthy values: non-empty strings
			 *
			 * @example
			 * ["hello", "", "world"] → ["hello", "world"]
			 * [] → []
			 * [""] → []
			 */
			.filter(Boolean)
	);
}

/**
 * Converts a string to SCREAMING_SNAKE_CASE format.
 *
 * This function first tokenizes the input string, then joins the tokens
 * with underscores and converts the result to uppercase.
 *
 * @param {string} input - The string to convert to screaming snake case
 * @returns {string} The input string converted to SCREAMING_SNAKE_CASE
 *
 * @example
 * toScreamingSnakeCase("helloWorld"); // returns "HELLO_WORLD"
 * @example
 * toScreamingSnakeCase("XMLHttpRequest"); // returns "XML_HTTP_REQUEST"
 * @example
 * toScreamingSnakeCase("user123"); // returns "USER_123"
 * @example
 * toScreamingSnakeCase("hello-world"); // returns "HELLO_WORLD"
 * @example
 * toScreamingSnakeCase(""); // returns ""
 *
 * @see tokenize
 */
export function toScreamingSnakeCase(input: string): string {
	if (!input) return "";
	return tokenize(input).join("_").toUpperCase();
}
