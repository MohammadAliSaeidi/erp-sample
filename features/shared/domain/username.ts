import z from "zod"

export const Username = z.string().min(4).max(20).regex(/^[a-zA-Z0-9_-]+$/)

export type Username = z.infer<typeof Username>