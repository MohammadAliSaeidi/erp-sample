import { NextRequest } from "next/server";

export type WithValidatedBody<
  Body,
  TBase extends NextRequest = NextRequest,
> = TBase & { validatedBody: Body };
