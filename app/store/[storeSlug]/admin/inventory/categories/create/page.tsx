"use client";

import CreateCategoryForm from "@/src/interface/ui/category/components/create-category-form";
import Breadcrumb from "./breadcrumb";

export default function CreateCategory() {
	return (
		<>
			<Breadcrumb />
			<CreateCategoryForm />
		</>
	);
}
