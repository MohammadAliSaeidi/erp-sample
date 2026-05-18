export class InvalidSpecificationValueIdError extends Error {
  constructor(specificationId: string) {
    super(`Invalid Specifciation Value Id: ${specificationId}`);
  }
}
