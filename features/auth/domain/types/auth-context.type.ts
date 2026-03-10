// What every protected handler receives after authorization succeeds.

import { Permission } from "./permission.type";

// Permissions are already resolved — handlers never need to look them up.
export type AuthContext = {
	adminId: string;
	storeId: string;
	roleId: string;
	permissions: Permission[];
};
