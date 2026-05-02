"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CreateSpecificationModal } from "@/interface/ui/specification/components/create-specification-modal";
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
        <CreateSpecificationModal categoryId={categoryId} />
        <SpecificationsList categoryId={categoryId} />
      </CardContent>
    </Card>
  );
}
