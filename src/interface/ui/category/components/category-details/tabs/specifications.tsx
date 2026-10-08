"use client";

import { CreateSpecificationModal } from "@/src/interface/ui/specification/components/create-specification-modal";
import SpecificationsList from "@/src/interface/ui/specification/components/specifications-list/list";
import {
	Card,
	CardContent,
} from "@/src/presentation/shared/components/ui/card";

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
