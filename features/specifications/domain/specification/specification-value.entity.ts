export type SpecificationValue = {
  id: string;
  value: string | boolean | number;
};

export const createSpecificationValue = (input: SpecificationValue) => {
  if (input.id.trim().length === 0)
    throw new Error("SpecificationValue id is required");

  if (input.value.toString().trim().length === 0) {
    throw new Error("SpecificationValue value is required");
  }

  return { ...input };
};
