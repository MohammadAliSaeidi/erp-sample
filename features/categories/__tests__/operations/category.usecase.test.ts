import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { CategoryNotFoundForStoreError } from "@/domain/category/errors/category-not-found-for-store.error";
import {
  buildCreateCategoryUsecase,
  CreateCategoryUsecaseDeps,
} from "@/application/category/usecase/create-category.usecase";
import {
  buildGetCategoryByIdUsecase,
  GetCategoryByIdUsecaseDeps,
} from "@/application/category/usecase/get-category-by-id.usecase";
import {
  buildListCategoriesUsecase,
  ListCategoriesUsecaseDeps,
} from "@/application/category/usecase/list-categories.operation";
import {
  buildUpdateCategoryUsecase,
  UpdateCategoryOperationDeps,
} from "@/application/category/usecase/update-category.usecase";
import {
  UseCaseForbiddenError,
  UseCaseNotFoundError,
  UseCaseValidationError,
} from "@/features/shared/application/errors/use-case-errors";
import { runUseCase } from "@/features/shared/application/run-use-case";
import { CategoryDTO } from "@/interface/dto/category/category.dto";

const STORE_ID = "store-1";
const CATEGORY_ID = "11111111-1111-4111-8111-111111111111";

const AUTH_CONTEXT: AuthContext = {
  adminId: "admin-1",
  storeId: STORE_ID,
  storeSlug: "store-1",
  username: "admin-user",
  roleId: "role-1",
  grantsAll: true,
  permissions: [
    "categories:read",
    "categories:read-details",
    "categories:create",
    "categories:update",
  ],
  sub: "",
  exp: 0,
  iat: 0,
};

describe("categories operations", () => {
  it("lists categories for the authenticated store", async () => {
    const mockedCategoryDTO: CategoryDTO = {
      id: CATEGORY_ID,
      name: "Phones",
      description: "description",
    };

    const deps: ListCategoriesUsecaseDeps = {
      getListByStoreId: jest.fn().mockResolvedValue([mockedCategoryDTO]),
    };
    const operation = buildListCategoriesUsecase(deps);

    const result = await runUseCase({
      useCase: operation,
      input: {},
      authContext: AUTH_CONTEXT,
    });

    expect(result).toHaveLength(1);
    expect(deps.getListByStoreId).toHaveBeenCalledWith(STORE_ID);
  });

  it("fails with OperationForbiddenError when permission is missing", async () => {
    const deps: ListCategoriesUsecaseDeps = {
      getListByStoreId: jest.fn(),
    };
    const operation = buildListCategoriesUsecase(deps);

    await expect(
      runUseCase({
        useCase: operation,
        input: {},
        authContext: { ...AUTH_CONTEXT, permissions: [] },
      }),
    ).rejects.toBeInstanceOf(UseCaseForbiddenError);
  });

  it("validates create input using the operation schema", async () => {
    const deps: CreateCategoryUsecaseDeps = {
      createCategory: jest.fn(),
    };
    const operation = buildCreateCategoryUsecase(deps);

    await expect(
      runUseCase({
        useCase: operation,
        input: { name: "" },
        authContext: AUTH_CONTEXT,
      }),
    ).rejects.toBeInstanceOf(UseCaseValidationError);
  });

  it("returns not found when get by id misses", async () => {
    const deps: GetCategoryByIdUsecaseDeps = {
      getByIdAndStoreId: jest.fn().mockResolvedValue(null),
    };
    const operation = buildGetCategoryByIdUsecase(deps);

    await expect(
      runUseCase({
        useCase: operation,
        input: { categoryId: CATEGORY_ID },
        authContext: AUTH_CONTEXT,
      }),
    ).rejects.toBeInstanceOf(UseCaseNotFoundError);
  });

  it("maps repository not-found during update into OperationNotFoundError", async () => {
    const deps: UpdateCategoryOperationDeps = {
      updateCategory: jest
        .fn()
        .mockRejectedValue(new CategoryNotFoundForStoreError(CATEGORY_ID)),
    };
    const operation = buildUpdateCategoryUsecase(deps);

    await expect(
      runUseCase({
        useCase: operation,
        input: {
          id: CATEGORY_ID,
          name: "Updated",
        },
        authContext: AUTH_CONTEXT,
      }),
    ).rejects.toBeInstanceOf(UseCaseNotFoundError);
  });
});
