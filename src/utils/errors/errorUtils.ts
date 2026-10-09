import { CLIENT_ERROR_MESSAGES, ClientError } from '../../errors';
import { SystemType } from '../../systems/base/types';

/** A node of the config tree. */
type ConfigNode = { [key: string]: { [key: string]: unknown } };

/** The config tree of myGEKKO device by system. */
type ConfigTree = { [system: string]: ConfigNode };

/**
 * Throws error if system is not enabled.
 * @param systemConfig - The config of myGEKKO device.
 * @param systemType - The system type.
 * @throws {@link ClientError}
 */
export function throwErrorIfSystemIsNotEnabled(
  systemConfig: ConfigTree | string,
  systemType: SystemType
): void {
  if (systemConfig.valueOf() == 0) {
    throw Error(CLIENT_ERROR_MESSAGES.SYSTEM_NOT_INITIALIZED);
  }

  if (!available(systemConfig as ConfigTree, systemType)) {
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
  trendConfig: ConfigTree | string,
  systemType: SystemType
): void {
  if (trendConfig.valueOf() == 0) {
    throw new ClientError(CLIENT_ERROR_MESSAGES.SYSTEM_NOT_INITIALIZED);
  }
  if (!available(trendConfig as ConfigTree, systemType)) {
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
  config: ConfigTree,
  systemType: SystemType,
  itemId: string
): void {
  const values = systemType.split('/');
  let s: ConfigNode = config;

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
export function available(config: ConfigTree, systemType: SystemType): boolean {
  const values = systemType.split('/');
  let s: ConfigNode = config;
  for (const i of values) {
    if (!s[i]) {
      return false;
    }
    s = config[i];
  }
  return true;
}
