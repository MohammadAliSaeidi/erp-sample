import { brand, Brand } from "@/lib/brand";
export type VendorId = Brand<string, "VendorId">;
export const toVendorId = (value: string): VendorId => brand<string, "VendorId">(value);
