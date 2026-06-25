import { buildRefreshLockUsecase } from "@/src/application/shared/lock-service/usecase/refresh-lock.usecase";
import { LockServicePort } from "@/src/application/shared/lock-service/lock-service.port";
import { LockKeys } from "@/src/application/shared/lock-service/lock-service.registry";
import { createItemLockInfrastructure } from "@/src/infrastructure/redis/item-lock-infrastructure";

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

const { lockService } = createItemLockInfrastructure();

export const refreshItemLockUsecase = buildRefreshItemLockUsecase({
  lockService,
});
