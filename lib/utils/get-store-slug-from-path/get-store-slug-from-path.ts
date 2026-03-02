export function getStoreSlugFromPath(path: string) {
	const match = path.match(/\/store\/[a-zA-Z1-9\-\_]+\//g);
	if (!match) return null;

	// match is something like: /store/<name-of-store>/page-1
	// so splitting it will give us something like:
	// ["", "store", "<name-of-the-store>", "/"]
	// as you see the first array item is empty string
	const storeSlug = match[0].split("/")[2];
	return storeSlug;
}
