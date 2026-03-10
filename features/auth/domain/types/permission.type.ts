// Exhaustive list of every atomic action in the system.
// This is the only thing that is hard-coded. Everything else is dynamic DB data.
export type Permission =
     | "items:read"
     | "items:create"
     | "items:update"
     | "items:delete"
     | "categories:read"
     | "categories:create"
     | "categories:update"
     | "categories:delete"
     | "roles:read"
     | "roles:create"
     | "roles:update"
     | "roles:delete"
     | "admins:read"
     | "admins:create"
     | "admins:update"
     | "admins:delete"
     | "store:settings:read"
     | "store:settings:update";