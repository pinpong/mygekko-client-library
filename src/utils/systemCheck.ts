export function throwErrorIfSystemIsNotEnabled(system?: string) {
  if (!system) {
    throw Error("System not enabled");
  }
}
