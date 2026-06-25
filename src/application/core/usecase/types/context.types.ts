export interface BaseContext {
  readonly requestId: string;
  readonly timestamp: Date;
  readonly metadata?: Record<string, unknown>;
}

export interface StoreAuthContext extends BaseContext {
  readonly storeId: string;
  readonly adminId: string;
  readonly permissions: readonly string[];
  readonly grantsAll: boolean;
}
