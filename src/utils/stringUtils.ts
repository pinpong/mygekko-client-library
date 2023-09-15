import { ItemStatusResponse, SystemConfig } from '../client';
import { CLIENT_ERROR } from '../errors';

/**
 * Converts string to list of strings
 * @param {string} values the string.
 * @returns {string[]} a list of values
 */
export function valuesToStringList(values: ItemStatusResponse): string[] {
  try {
    return (values['sumstate']['value'] as string).slice(0, -1).split(';');
  } catch (e) {
    throw new Error(CLIENT_ERROR.CANNOT_PARSE_STATUS);
  }
}

/**
 * Filters system config by items
 * @param {SystemConfig} systemConfig  the myGEKKO device system config.
 * @returns {string[]} a filtered list of items
 */
export function systemFilteredByItems(systemConfig: SystemConfig): string[] {
  return Object.keys(systemConfig).filter((key) => key.includes('item'));
}

/**
 * Filters system config by groups
 * @param {SystemConfig} systemConfig  the myGEKKO device system config.
 * @returns {string[]} a filtered list of groups
 */
export function systemFilteredByGroup(systemConfig: SystemConfig): string[] {
  return Object.keys(systemConfig).filter((key) => key.includes('group'));
}
