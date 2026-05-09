import { PrimitiveFilterType } from "./filter-inputs.types";

export function defineFilterMap<TFilter extends object>() {
  return <TMap extends Partial<Record<keyof TFilter, PrimitiveFilterType>>>(map: TMap) => map;
}
