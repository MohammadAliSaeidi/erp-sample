import { SpecificationDTO } from "@/src/application/specification/dto/specification.dto";
import { TypographyP } from "@/src/presentation/shared/components/ui/typography/typography-p";

export default function SpecificationListItem(specification: SpecificationDTO) {
	const {
		isActive,
		isPrimary,
		isRequired,
		name,
		type,
		specificationValues,
	} = specification;

	return (
		<div className="space-y-2">
			<TypographyP>{name}</TypographyP>
		</div>
	);
}
