"use client";

import {
  Breadcrumb as BreadcrumbUIComponent,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { URLS } from "@/constants/urls";
import { useStoreUrlSlug } from "@/features/shared/hooks/use-store-url-slug";
import Link from "next/link";

type BreadcrumbProps = {
  categoryName?: string;
};

export default function Breadcrumb(props: BreadcrumbProps) {
  const { categoryName } = props;
  const storeSlug = useStoreUrlSlug();

  return (
    <BreadcrumbUIComponent>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={storeSlug ? URLS.STORE.ADMIN.DASHBOARD(storeSlug) : "#"}>
              Dashboard
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href={storeSlug ? URLS.STORE.ADMIN.INVENTORY.INDEX(storeSlug) : "#"}
            >
              Inventory
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href={
                storeSlug
                  ? URLS.STORE.ADMIN.INVENTORY.CATEGORIES.LIST(storeSlug)
                  : "#"
              }
            >
              Categories
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {categoryName && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-primary">{categoryName}</BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </BreadcrumbUIComponent>
  );
}
