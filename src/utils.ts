/* eslint-disable  @typescript-eslint/no-explicit-any */
export function applyMixins(
  derivedConstructors: any,
  constructors: any[],
): void {
  constructors.forEach((baseConstructors) => {
    Object.getOwnPropertyNames(baseConstructors.prototype).forEach((name) => {
      Object.defineProperty(
        derivedConstructors.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseConstructors.prototype, name),
      );
    });
  });
}
