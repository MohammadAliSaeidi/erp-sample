import { Card, CardContent } from "@/components/ui/card";
import { SpecificationValueType } from "@/features/specifications/domain/specification/specification-value-type.enum";
import { SpecificationDTO } from "@/features/specifications/interface/dto/specification/specification.dto";

const specs: SpecificationDTO[] = [
  {
    categoryId: "1",
    id: "1",
    isActive: true,
    isPrimary: true,
    isRequired: false,
    name: "Color",
    specificationValues: [
      {
        id: "1",
        value: "Red",
      },
      {
        id: "2",
        value: "Blue",
      },
      {
        id: "3",
        value: "Green",
      },
    ],
    storeId: "1",
    type: SpecificationValueType.STRING,
  },
  {
    categoryId: "1",
    id: "2",
    isActive: false,
    isPrimary: false,
    isRequired: true,
    name: "Size",
    specificationValues: [
      {
        id: "1",
        value: "Small",
      },
      {
        id: "2",
        value: "Medium",
      },
      {
        id: "3",
        value: "Large",
      },
    ],
    storeId: "1",
    type: SpecificationValueType.STRING,
  },
  {
    categoryId: "1",
    id: "2",
    isActive: false,
    isPrimary: false,
    isRequired: true,
    name: "Storage",
    specificationValues: [
      {
        id: "1",
        value: "64GB",
      },
      {
        id: "2",
        value: "128GB",
      },
      {
        id: "3",
        value: "256GB",
      },
    ],
    storeId: "1",
    type: SpecificationValueType.STRING,
  },
];

export default function CategoryDetailsSpecifications() {
  return (
    <Card>
      <CardContent>

      </CardContent>
    </Card>
  );
}
