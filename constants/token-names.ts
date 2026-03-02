import { convertToScreamingSnakeCase } from "@/lib/utils/convertToScreamingSnakeCase";

export const ADMIN_ACCESS_TOKEN_NAME = (storeSlug: string) =>
	`ADMIN_ACCESS_TOKEN_${convertToScreamingSnakeCase(storeSlug)}`;

