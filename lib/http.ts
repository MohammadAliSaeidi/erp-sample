import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { getStoreSlugFromPath } from "./utils/get-store-slug-from-path";

const LOGIN_PAGES = {} as const;

type LoginPagePrefix = keyof typeof LOGIN_PAGES;
const LOGIN_PAGE_PREFIXES = Object.keys(LOGIN_PAGES) as LoginPagePrefix[];

function getStoreLoginPath(currentPath: string): string | null {
  const storeSlug = getStoreSlugFromPath(currentPath);

  return `/store/${storeSlug}/login`;
}

function redirectToLogin(currentPath: string) {
  const storeLoginPath = getStoreLoginPath(currentPath);
  if (storeLoginPath) {
    if (currentPath !== storeLoginPath) {
      window.location.href = storeLoginPath;
    }
    return;
  }

  const match = LOGIN_PAGE_PREFIXES.find((prefix) =>
    currentPath.startsWith(prefix),
  );
  const loginUrl = match ? LOGIN_PAGES[match] : "/login";

  if (currentPath !== loginUrl) {
    window.location.href = loginUrl;
  }
}

const http: AxiosInstance = axios.create({
  timeout: 10000,
  withCredentials: true,
});

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    if (process.env.NODE_ENV === "development") console.log(error);

    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        const currentPath = window.location.pathname;
        redirectToLogin(currentPath);
      }
    }

    return Promise.reject(error);
  },
);

export default http;
