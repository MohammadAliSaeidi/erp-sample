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
} from "@/application/category/usecase/list-categories.usecase";
import {
  buildUpdateCategoryUsecase,
  UpdateCategoryUsecaseDeps,
} from "@/application/category/usecase/update-category.usecase";
import {
  UseCaseForbiddenError,
  UseCaseNotFoundError,
  UseCaseValidationError,
} from "@/application/errors/use-case-errors";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { CategoryDTO } from "@/interface/dto/category/category.dto";
import { uuid7GeneratorAdapter } from "@/lib/id-generator/uuid-generator.adapter";
import { brand } from "@/lib/brand";

const STORE_ID = "store-1";
const CATEGORY_ID = uuid7GeneratorAdapter.generate();

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

describe("categories usecases", () => {
  it("throws error after trying to update a category and the category is not for the store", async () => {
    const usecase = buildUpdateCategoryUsecase({
      updateCategory: jest
        .fn()
        .mockRejectedValue(
          new CategoryNotFoundForStoreError(CATEGORY_ID, STORE_ID),
        ),
    });

    await expect(
      runUsecase({
        useCase: usecase,
        input: { id: CATEGORY_ID, name: "Updated" },
        authContext: AUTH_CONTEXT,
      }),
    ).rejects.toThrow(CategoryNotFoundForStoreError);
  });

  it("throws error after trying to get a category by id and the category is not for the store", async () => {
    const usecase = buildGetCategoryByIdUsecase({
      getByIdAndStoreId: jest
        .fn()
        .mockRejectedValue(
          new CategoryNotFoundForStoreError(CATEGORY_ID, STORE_ID),
        ),
    });

    await expect(
      runUsecase({
        useCase: usecase,
        input: { categoryId: CATEGORY_ID },
        authContext: AUTH_CONTEXT,
      }),
    ).rejects.toThrow(CategoryNotFoundForStoreError);
  });

  it("lists categories for the authenticated store", async () => {
    const mockedCategoryDTO: CategoryDTO = {
      id: brand(CATEGORY_ID),
      name: "Phones",
      description: "description",
    };

    const deps: ListCategoriesUsecaseDeps = {
      getListByStoreId: jest.fn().mockResolvedValue([mockedCategoryDTO]),
    };

    const usecase = buildListCategoriesUsecase(deps);

    const result = await runUsecase({
      useCase: usecase,
      input: {},
      authContext: AUTH_CONTEXT,
    });

    expect(result).toHaveLength(1);
    expect(deps.getListByStoreId).toHaveBeenCalledWith(STORE_ID);
  });

  it("calls repository with storeId from authContext", async () => {
    const updateCategory = jest.fn().mockResolvedValue({
      id: brand(CATEGORY_ID),
      name: "Updated",
    });

    const usecase = buildUpdateCategoryUsecase({ updateCategory });

    await runUsecase({
      useCase: usecase,
      input: { id: CATEGORY_ID, name: "Updated" },
      authContext: AUTH_CONTEXT,
    });

    expect(updateCategory).toHaveBeenCalledWith(
      { id: CATEGORY_ID, name: "Updated" },
      STORE_ID,
    );
  });

  it("fails with UseCaseForbiddenError when permission is missing", async () => {
    const deps: ListCategoriesUsecaseDeps = {
      getListByStoreId: jest.fn(),
    };
    const usecase = buildListCategoriesUsecase(deps);

    await expect(
      runUsecase({
        useCase: usecase,
        input: {},
        authContext: {
          ...AUTH_CONTEXT,
          grantsAll: false,
          permissions: [],
        },
      }),
    ).rejects.toBeInstanceOf(UseCaseForbiddenError);
  });

  it("fails when name is empty", async () => {
    const usecase = buildUpdateCategoryUsecase({
      updateCategory: jest.fn(),
    });
  
    await expect(
      runUsecase({
        useCase: usecase,
        input: { id: CATEGORY_ID, name: "" },
        authContext: AUTH_CONTEXT,
      }),
    ).rejects.toBeInstanceOf(UseCaseValidationError);
  });

  it("fails when id is invalid", async () => {
    const usecase = buildUpdateCategoryUsecase({
      updateCategory: jest.fn(),
    });

    await expect(
      runUsecase({
        useCase: usecase,
        input: { id: "invalid", name: "Updated" },
        authContext: AUTH_CONTEXT,
      }),
    ).rejects.toBeInstanceOf(UseCaseValidationError);
  });
  
  it('fails when id is uuidv4', async () => {
    const usecase = buildUpdateCategoryUsecase({
      updateCategory: jest.fn(),
    });

    const uuidv4 = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

    await expect(
      runUsecase({
        useCase: usecase,
        input: { id: uuidv4, name: "Updated" },
        authContext: AUTH_CONTEXT,
      }),
    ).rejects.toBeInstanceOf(UseCaseValidationError);
  })

  it('accepts uuidv7', async () => {
    const usecase = buildUpdateCategoryUsecase({
      updateCategory: jest.fn(),
    });

    const uuidv7 = uuid7GeneratorAdapter.generate();
    
    await expect(
      runUsecase({
        useCase: usecase,
        input: { id: uuidv7, name: "Updated" },
        authContext: AUTH_CONTEXT,
      }),
    ).resolves.not.toThrow();
  })
  
  it("validates create input using the usecase schema", async () => {
    const deps: CreateCategoryUsecaseDeps = {
      createCategory: jest.fn(),
    };
    const usecase = buildCreateCategoryUsecase(deps);

    await expect(
      runUsecase({
        useCase: usecase,
        input: { name: "" },
        authContext: AUTH_CONTEXT,
      }),
    ).rejects.toBeInstanceOf(UseCaseValidationError);
  });

  it("returns not found when get by id misses", async () => {
    const deps: GetCategoryByIdUsecaseDeps = {
      getByIdAndStoreId: jest.fn().mockResolvedValue(null),
    };
    const usecase = buildGetCategoryByIdUsecase(deps);

    await expect(
      runUsecase({
        useCase: usecase,
        input: { categoryId: CATEGORY_ID },
        authContext: AUTH_CONTEXT,
      }),
    ).rejects.toBeInstanceOf(UseCaseNotFoundError);
  });

  it("maps repository not-found during update into UseCaseNotFoundError", async () => {
    const deps: UpdateCategoryUsecaseDeps = {
      updateCategory: jest
        .fn()
        .mockRejectedValue(
          new CategoryNotFoundForStoreError(CATEGORY_ID, STORE_ID),
        ),
    };

    const usecase = buildUpdateCategoryUsecase(deps);

    await expect(
      runUsecase({
        useCase: usecase,
        input: {
          id: CATEGORY_ID,
          name: "Updated",
        },
        authContext: AUTH_CONTEXT,
      }),
    ).rejects.toThrow(CategoryNotFoundForStoreError);
  });
});
