import { ItemStatusResponse, SystemItemsConfig } from '../../client';
import { CLIENT_ERROR_MESSAGES, ClientError } from '../../errors';

/**
 * Converts string to list of strings.
 * @param values - The string.
 * @throws {@link ClientError}
 */
export function valuesToStringList(values: ItemStatusResponse): string[] {
  try {
    const value = values.sumstate.value;
    return (value.endsWith(';') ? value.slice(0, -1) : value).split(';');
  } catch (e) {
    throw new ClientError(CLIENT_ERROR_MESSAGES.CANNOT_PARSE_STATUS);
  }
}

/**
 * Filters system config by items.
 * @param systemConfig - The myGEKKO device system config.
 */
export function systemFilteredByItems(systemConfig: SystemItemsConfig | string): string[] {
  return Object.keys(systemConfig).filter((key) => key.includes('item'));
}

/**
 * Filters system config by groups.
 * @param systemConfig - The myGEKKO device system config.
 */
export function systemFilteredByGroup(systemConfig: SystemItemsConfig | string): string[] {
  return Object.keys(systemConfig).filter((key) => key.includes('group'));
}

/**
 * Extracts the unit from a myGEKKO value format, e.g. `kLx` from `float[0.00,100000.00](kLx)`.
 * @param format - The value format.
 */
export function unitFromFormat(format: string | undefined): string | null {
  const unit = format?.match(/\(([^()]*)\)\s*$/)?.[1];
  return unit ? unit : null;
}
