export function throwErrorIfSystemIsNotEnabled(system?: string): void {
  if (!system) {
    throw Error("System not enabled");
  }
}
