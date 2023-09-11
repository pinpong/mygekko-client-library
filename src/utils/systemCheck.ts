import { CLIENT_ERROR } from '../errors';

export function throwErrorIfSystemIsNotEnabled(system: string, res: string[]): void {
  if (system?.length == 0) {
    throw Error(CLIENT_ERROR.SYSTEM_NOT_INITIALIZED);
  } else {
    let s = system;
    for (const i of res) {
      if (!s[i]) {
        throw Error(CLIENT_ERROR.SYSTEM_NOT_ENABLED);
      }
      s = system[i];
    }
  }
}
