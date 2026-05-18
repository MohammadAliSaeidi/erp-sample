export class InvalidSpecificationIdError extends Error {
  constructor(specificationId: string) {
    super(`Invalid Specifciation Id: ${specificationId}`);
  }
}
