"use client";

import { Card, CardContent } from "@/components/ui/card";
import SpecificationsList from "@/interface/ui/specification/components/specifications-list/list";

type CategoryDetailsSpecificationsTabProps = {
  categoryId: string;
};

export default function CategoryDetailsSpecificationsTab(
  props: CategoryDetailsSpecificationsTabProps,
) {
  const { categoryId } = props;

  return (
    <Card>
      <CardContent>
        <SpecificationsList categoryId={categoryId} />
      </CardContent>
    </Card>
  );
}
