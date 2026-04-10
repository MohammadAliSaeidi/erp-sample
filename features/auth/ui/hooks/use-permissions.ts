import { can } from "../../domain/lib/can";
import { Permission } from "../../domain/types/permission.type";
import { useAuthStore } from "../auth-store";

// The only hook UI components should call for permission checks.
// Returns a `can` function scoped to the current user's permissions.
//
// Usage:
//   const { can } = usePermissions()
//   const showButton = can("items:create")
//   const showSection = can(["items:read", "categories:read"])

export const usePermissions = () => {
	const permissions = useAuthStore((state) => state.permissions);

	return {
		permissions,
		can: (required: Permission | Permission[]): boolean =>
			can(permissions, required),
	};
};
