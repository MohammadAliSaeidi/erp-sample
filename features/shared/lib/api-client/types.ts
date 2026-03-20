export type FetchOptions = RequestInit & {
	skipAuthRedirect?: boolean;
};

export interface RedirectHandler {
	redirectToLogin(): Promise<void>;
}

export interface ApiClient {
	get<T>(url: string, options?: FetchOptions): Promise<T>;
	post<T>(url: string, body: unknown, options?: FetchOptions): Promise<T>;
	put<T>(url: string, body: unknown, options?: FetchOptions): Promise<T>;
	delete<T>(url: string, options?: FetchOptions): Promise<T>;
}
