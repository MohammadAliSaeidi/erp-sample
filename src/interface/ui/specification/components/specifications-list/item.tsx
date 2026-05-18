import { TypographyP } from "@/src/presentation/components/ui/typography/typography-p";
import { SpecificationDTO } from "@/src/application/specification/dto/specification.dto";

export default function SpecificationListItem(specification: SpecificationDTO) {
  const { isActive, isPrimary, isRequired, name, type, specificationValues } =
    specification;

  return (
    <div className="space-y-2">
      <TypographyP>{name}</TypographyP>
    </div>
  );
}
