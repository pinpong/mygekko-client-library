import { CLIENT_ERROR } from "../errors";

export function throwErrorIfSystemIsNotEnabled(system?: string): void {
  if (!system) {
    throw Error(CLIENT_ERROR.SYSTEM_NOT_ENABLED);
  }
}
