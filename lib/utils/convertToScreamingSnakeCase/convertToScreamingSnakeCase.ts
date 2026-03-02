export const convertToScreamingSnakeCase = (input: string) => {
	return input.toUpperCase().trim().replace(/\s+/g, "_");
};
