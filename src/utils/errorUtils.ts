import { SystemConfig } from '../client';
import { CLIENT_ERROR } from '../errors';
import { SystemType } from '../systems/base/types';

/**
 * Throws error if system is not enabled
 * @param {SystemConfig} systemConfig  the config of myGEKKO device.
 * @param {SystemType} res the system type
 */
export function throwErrorIfSystemIsNotEnabled(systemConfig: SystemConfig, res: SystemType): void {
  if (systemConfig.valueOf() == 0) {
    throw Error(CLIENT_ERROR.SYSTEM_NOT_INITIALIZED);
  }

  if (!available(systemConfig, res)) {
    throw Error(CLIENT_ERROR.SYSTEM_NOT_SUPPORTED);
  }
}

/**
 * Throws error if trend is not enabled
 * @param {SystemConfig} trendConfig the config of myGEKKO device.
 * @param {SystemType} res the system type
 * @throws
 */
export function throwErrorIfTrendIsNotEnabled(trendConfig: SystemConfig, res: SystemType): void {
  if (trendConfig.valueOf() == 0) {
    throw new Error(CLIENT_ERROR.SYSTEM_NOT_INITIALIZED);
  }
  if (!available(trendConfig, res)) {
    throw new Error(CLIENT_ERROR.TREND_NOT_SUPPORTED);
  }
}

/**
 * Throws error if itemId is not found
 * @param {SystemConfig} config  the config of myGEKKO device.
 * @param {SystemType} res the system type.
 * @param {string} itemId  the item id.
 * @throws
 */
export function throwErrorIfItemIdIsNoFound(
  config: SystemConfig,
  res: SystemType,
  itemId: string
): void {
  const values = res.split('/');
  let s = config;

  for (const i of values) {
    if (values.lastIndexOf(i) === values.length - 1) {
      if (!s[i][itemId]) {
        throw new Error(CLIENT_ERROR.ITEM_ID_NOT_FOUND);
      }
      break;
    }
    s = config[i];
  }
}

/**
 * Checks if config includes system type
 * @param {SystemConfig} config the config of myGEKKO device.
 * @param {SystemType} res the system type.
 * @returns {boolean} true if available otherwise false
 */
function available(config: SystemConfig, res: SystemType): boolean {
  const values = res.split('/');
  let s = config;
  for (const i of values) {
    if (!s[i]) {
      return false;
    }
    s = config[i];
  }
  return true;
}
