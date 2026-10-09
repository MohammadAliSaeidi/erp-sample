import z from "zod";
import { loginInputDTOSchema } from "./login-input-dto.schema";

export type LoginInputDTO = z.infer<typeof loginInputDTOSchema>;
