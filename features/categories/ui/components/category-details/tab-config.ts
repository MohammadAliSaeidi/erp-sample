// features/categories/tabs/category-tabs.config.ts
import { TabConfig } from "@/lib/tabs/types";
import CategoryOverview from "./tabs/category-overview";
import CategoryDetailsSpecifications from "./tabs/specifications";

export enum CategoryTab {
  Overview = "overview",
  Specifications = "specifications",
  Items = "items",
  Documents = "documents",
  Photos = "photos",
}

export type CategoryTabProps = {
  categoryId: string;
  categoryName: string;
};

export const categoryTabsConfig: Record<
  CategoryTab,
  TabConfig<CategoryTab, CategoryTabProps>
> = {
  [CategoryTab.Overview]: {
    value: CategoryTab.Overview,
    label: "Overview",
    component: CategoryOverview,
  },
  [CategoryTab.Specifications]: {
    value: CategoryTab.Specifications,
    label: "Specifications",

    component: CategoryDetailsSpecifications,
  },
  [CategoryTab.Items]: {
    value: CategoryTab.Items,
    label: "Items",
    disabled: true,
    component: () => null,
  },
  [CategoryTab.Documents]: {
    value: CategoryTab.Documents,
    label: "Documents",
    disabled: true,
    component: () => null,
  },
  [CategoryTab.Photos]: {
    value: CategoryTab.Photos,
    label: "Photos",
    disabled: true,
    component: () => null,
  },
};
