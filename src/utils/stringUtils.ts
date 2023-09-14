import { CLIENT_ERROR } from '../errors';

export function valuesToStringList(values: string, key: string | null): string[] {
  try {
    if (key && values[key]) {
      return (values[key]['sumstate']['value'] as string).slice(0, -1).split(';');
    } else {
      return (values['sumstate']['value'] as string).slice(0, -1).split(';');
    }
  } catch (e) {
    throw new Error(CLIENT_ERROR.CANNOT_PARSE_STATUS);
  }
}

export function systemFilteredByItems(systemConfig: string): string[] {
  return Object.keys(systemConfig).filter((key) => key.includes('item'));
}

export function systemFilteredByGroup(systemConfig: string): string[] {
  return Object.keys(systemConfig).filter((key) => key.includes('group'));
}
