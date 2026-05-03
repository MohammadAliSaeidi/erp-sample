import z from "zod";

export const usernameSchema = z.string().min(4).max(20).regex(/^[a-zA-Z0-9_-]+$/)