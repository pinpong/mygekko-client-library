import { ItemStatusResponse, SystemConfig } from '../../client';
import { CLIENT_ERROR_MESSAGES, ClientError } from '../../errors';

/**
 * Converts string to list of strings.
 * @param values - The string.
 * @throws {@link ClientError}
 */
export function valuesToStringList(values: ItemStatusResponse): string[] {
  try {
    return values.sumstate.value.slice(0, -1).split(';');
  } catch (e) {
    throw new ClientError(CLIENT_ERROR_MESSAGES.CANNOT_PARSE_STATUS);
  }
}

/**
 * Filters system config by items.
 * @param systemConfig - The myGEKKO device system config.
 */
export function systemFilteredByItems(systemConfig: SystemConfig): string[] {
  return Object.keys(systemConfig).filter((key) => key.includes('item'));
}

/**
 * Filters system config by groups.
 * @param systemConfig - The myGEKKO device system config.
 */
export function systemFilteredByGroup(systemConfig: SystemConfig): string[] {
  return Object.keys(systemConfig).filter((key) => key.includes('group'));
}
