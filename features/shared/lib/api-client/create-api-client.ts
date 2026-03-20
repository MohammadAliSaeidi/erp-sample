import type { ApiClient, FetchOptions, RedirectHandler } from "./types";

interface ApiClientConfig {
	redirectHandler: RedirectHandler;
}

function createApiFetch(config: ApiClientConfig) {
	return async function apiFetch<T>(
		url: string,
		options: FetchOptions = {},
	): Promise<T> {
		const { skipAuthRedirect = false, ...fetchOptions } = options;

		const response = await fetch(url, {
			credentials: "include",
			...fetchOptions,
		});

		if (response.status === 401 && !skipAuthRedirect) {
			await config.redirectHandler.redirectToLogin();
		}

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			throw new Error(
				error.message ?? `HTTP error: ${response.status}`,
			);
		}

		return response.json() as Promise<T>;
	};
}

export function createApiClient(config: ApiClientConfig): ApiClient {
	const apiFetch = createApiFetch(config);

	return {
		get: (url, options) => apiFetch(url, { ...options, method: "GET" }),

		post: (url, body, options) =>
			apiFetch(url, {
				...options,
				method: "POST",
				body: JSON.stringify(body),
			}),

		put: (url, body, options) =>
			apiFetch(url, {
				...options,
				method: "PUT",
				body: JSON.stringify(body),
			}),

		delete: (url, options) =>
			apiFetch(url, { ...options, method: "DELETE" }),
	};
}
