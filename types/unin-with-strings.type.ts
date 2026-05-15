export type ExtensibleStringUnion<TUnion extends number | string | symbol> = string & Omit<string, TUnion>;
