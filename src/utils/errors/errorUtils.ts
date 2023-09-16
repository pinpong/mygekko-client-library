import { SystemConfig } from '../../client';
import { CLIENT_ERROR_MESSAGES, ClientError } from '../../errors';
import { SystemType } from '../../systems/base/types';

/**
 * Throws error if system is not enabled.
 * @param systemConfig - The config of myGEKKO device.
 * @param systemType - The system type.
 * @throws {@link ClientError}
 */
export function throwErrorIfSystemIsNotEnabled(
  systemConfig: SystemConfig,
  systemType: SystemType
): void {
  if (systemConfig.valueOf() == 0) {
    throw Error(CLIENT_ERROR_MESSAGES.SYSTEM_NOT_INITIALIZED);
  }

  if (!available(systemConfig, systemType)) {
    throw Error(CLIENT_ERROR_MESSAGES.SYSTEM_NOT_SUPPORTED);
  }
}

/**
 * Throws error if trend is not enabled.
 * @param trendConfig - The config of myGEKKO device.
 * @param systemType - The system type.
 * @throws {@link ClientError}
 */
export function throwErrorIfTrendIsNotEnabled(
  trendConfig: SystemConfig,
  systemType: SystemType
): void {
  if (trendConfig.valueOf() == 0) {
    throw new ClientError(CLIENT_ERROR_MESSAGES.SYSTEM_NOT_INITIALIZED);
  }
  if (!available(trendConfig, systemType)) {
    throw new ClientError(CLIENT_ERROR_MESSAGES.TREND_NOT_SUPPORTED);
  }
}

/**
 * Throws error if itemId is not found.
 * @param config - The config of myGEKKO device.
 * @param systemType - The system type.
 * @param itemId - The item id.
 * @throws {@link ClientError}
 */
export function throwErrorIfItemIdIsNoFound(
  config: SystemConfig,
  systemType: SystemType,
  itemId: string
): void {
  const values = systemType.split('/');
  let s = config;

  for (const i of values) {
    if (values.lastIndexOf(i) === values.length - 1) {
      if (!s[i][itemId]) {
        throw new ClientError(CLIENT_ERROR_MESSAGES.ITEM_ID_NOT_FOUND);
      }
      break;
    }
    s = config[i];
  }
}

/**
 * Checks if config includes system type.
 * @param config - The config of myGEKKO device.
 * @param systemType - The system type.
 */
function available(config: SystemConfig, systemType: SystemType): boolean {
  const values = systemType.split('/');
  let s = config;
  for (const i of values) {
    if (!s[i]) {
      return false;
    }
    s = config[i];
  }
  return true;
}
