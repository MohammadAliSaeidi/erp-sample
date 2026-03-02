/**
 * Validates if a path is a safe relative URL for redirection.
 * @param path - The path to validate
 * @returns True if safe for internal redirect
 */
export function isSafeRelativePath(
	path: string | null | undefined,
): path is string {
	if (!path || typeof path !== "string") return false;

	// Must start with / but not //
	if (!path.startsWith("/") || path.startsWith("//")) return false;

	// Block dangerous schemes (XSS prevention)
	const dangerousPrefixes = [
		"http:",
		"https:",
		"data:",
		"javascript:",
		"vbscript:",
		"file:",
		"about:",
	];

	const normalized = path.toLowerCase().trim();
	if (dangerousPrefixes.some((prefix) => normalized.startsWith(prefix))) {
		return false;
	}

	// Optional: Limit length (DoS protection)
	if (path.length > 300) return false;

	// Add custom rules here, e.g.:
	// if (!path.startsWith('/app/') && !path.startsWith('/dashboard')) return false; // Allow-list example

	return true;
}

/**
 * Gets a safe redirect path, falling back to default.
 * Handles array params (edge case from query strings).
 * @param redirectParam - Raw redirect value from query
 * @param defaultPath - Fallback path (default: '/dashboard')
 * @returns Safe path string
 */
export function getSafeRedirect(
	redirectParam: string | string[] | undefined | null,
	defaultPath = "/dashboard",
): string {
	let path: string | undefined;

	if (Array.isArray(redirectParam)) {
		// Take first if array.
		// for example:
		// "https://www.erp.com/store/my-store/login?redirect=/store/my-store-dashboard,/store/my-store/dashboard/page1"
		path = redirectParam[0];
	} else {
		path = redirectParam ?? undefined;
	}

	return isSafeRelativePath(path) ? path : defaultPath;
}
