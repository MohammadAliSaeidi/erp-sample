import type { ReactNode } from "react";
import { Permission } from "../../domain/types/permission.type";
import { usePermissions } from "../hooks/use-permissions";

// hide    — renders nothing (default). Use when the action shouldn't be discoverable.
// disable — renders children wrapped in a non-interactive overlay.
//           Use when the user should know the action exists but can't take it.
// message — renders a plain "no permission" message in place of children.
//           Use for page sections or empty states.

type GateBehavior = "hide" | "disable" | "message";

type GateProps = {
	// One permission or many — all must be satisfied
	permission: Permission | Permission[];
	children: ReactNode;
	// Custom fallback for "hide" behavior (e.g. an upgrade CTA)
	fallback?: ReactNode;
	behavior?: GateBehavior;
	// Optional custom message for "message" behavior
	noAccessMessage?: string;
};

// Keeps permission logic out of feature components entirely.
// Feature components stay dumb — Gate handles the access decision.
//
// Usage:
//   <Gate permission="items:create">
//     <CreateItemButton />
//   </Gate>
//
//   <Gate permission="roles:create" behavior="disable">
//     <CreateRoleButton />
//   </Gate>
//
//   <Gate permission="store:settings:update" behavior="message">
//     <SettingsForm />
//   </Gate>
//
//   <Gate permission="admins:create" fallback={<UpgradeBanner />}>
//     <InviteAdminButton />
//   </Gate>

export const Gate = ({
	permission,
	children,
	fallback = null,
	behavior = "hide",
	noAccessMessage = "You don't have permission to perform this action.",
}: GateProps) => {
	const { can } = usePermissions();
	const allowed = can(permission);

	if (allowed) return <>{children}</>;

	if (behavior === "message") {
		return (
			<p className="text-sm text-muted-foreground" role="status">
				{noAccessMessage}
			</p>
		);
	}

	if (behavior === "disable") {
		return (
			<div
				className="pointer-events-none select-none opacity-50"
				aria-disabled="true"
			>
				{children}
			</div>
		);
	}

	// behavior === "hide"
	return <>{fallback}</>;
};
