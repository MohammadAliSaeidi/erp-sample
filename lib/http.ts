import { redirect, RedirectType } from "next/navigation";
import { getStoreSlugFromPath } from "./utils/get-store-slug-from-path";

const LOGIN_PAGES = {} as const;

type LoginPagePrefix = keyof typeof LOGIN_PAGES;
const LOGIN_PAGE_PREFIXES = Object.keys(LOGIN_PAGES) as LoginPagePrefix[];

function getStoreLoginPath(currentPath: string): string | null {
  const storeSlug = getStoreSlugFromPath(currentPath);

  return `/store/${storeSlug}/admin/login`;
}

function redirectToLogin(currentPath: string) {
  const storeLoginPath = getStoreLoginPath(currentPath);
  if (storeLoginPath) {
    if (currentPath !== storeLoginPath) {
      redirect(storeLoginPath, RedirectType.replace);
    }
    return;
  }

  const match = LOGIN_PAGE_PREFIXES.find((prefix) =>
    currentPath.startsWith(prefix),
  );
  const loginUrl = match ? LOGIN_PAGES[match] : "/login";

  if (currentPath !== loginUrl) {
    redirect(loginUrl, RedirectType.replace);
  }
}

type FetchOptions = RequestInit & {
  skipAuthRedirect?: boolean;
};

async function apiFetch<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const { skipAuthRedirect = false, ...fetchOptions } = options;

  const response = await fetch(url, { ...fetchOptions });

  if (response.status === 401 && !skipAuthRedirect) {
    if (typeof window !== "undefined") {
      // Client-side redirect
      const currentPath = window.location.pathname;
      redirectToLogin(currentPath);
    } else {
      // Server-side redirect
      const { redirect } = await import("next/navigation");
      redirect("/login");
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? `HTTP error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(url: string, options?: FetchOptions) =>
    apiFetch<T>(url, { ...options, method: "GET" }),

  post: <T>(url: string, body: unknown, options?: FetchOptions) =>
    apiFetch<T>(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(url: string, body: unknown, options?: FetchOptions) =>
    apiFetch<T>(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(url: string, options?: FetchOptions) =>
    apiFetch<T>(url, { ...options, method: "DELETE" }),
};
