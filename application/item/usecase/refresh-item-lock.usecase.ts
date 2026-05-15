import { buildRefreshLockUsecase } from "@/application/shared/lock-service/usecase/refresh-lock.usecase";
import { LockServicePort } from "@/application/shared/lock-service/lock-service.port";
import { LockKeys } from "@/application/shared/lock-service/lock-service.registry";

export const buildRefreshItemLockUsecase = (deps: {
  lockService: LockServicePort;
}) =>
  buildRefreshLockUsecase({
    key: "item.refresh-lock",
    permissions: ["items:update"],
    lockService: deps.lockService,
    buildLockKey: (storeId: string, itemId: string) =>
      LockKeys.item(storeId, itemId),
  });
