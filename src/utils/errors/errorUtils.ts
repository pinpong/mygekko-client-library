import { CLIENT_ERROR_MESSAGES, ClientError } from '../../errors';
import { SystemType } from '../../systems/base/types';

/** A config of myGEKKO device, a string as long as it is not loaded. */
type Config = { [key: string]: unknown } | string;

/**
 * Returns the node below the path or undefined if not found.
 * @param config - The config of myGEKKO device.
 * @param path - The keys to follow.
 */
function find(config: Config, path: string[]): unknown {
  let node: unknown = config;
  for (const key of path) {
    if (typeof node !== 'object' || node === null) {
      return undefined;
    }
    node = (node as { [key: string]: unknown })[key];
  }
  return node;
}

/**
 * Throws error if system is not enabled.
 * @param systemConfig - The config of myGEKKO device.
 * @param systemType - The system type.
 * @throws {@link ClientError}
 */
export function throwErrorIfSystemIsNotEnabled(systemConfig: Config, systemType: SystemType): void {
  if (systemConfig.valueOf() == 0) {
    throw new ClientError(CLIENT_ERROR_MESSAGES.SYSTEM_NOT_INITIALIZED);
  }

  if (!available(systemConfig, systemType)) {
    throw new ClientError(CLIENT_ERROR_MESSAGES.SYSTEM_NOT_SUPPORTED);
  }
}

/**
 * Throws error if trend is not enabled.
 * @param trendConfig - The config of myGEKKO device.
 * @param systemType - The system type.
 * @throws {@link ClientError}
 */
export function throwErrorIfTrendIsNotEnabled(trendConfig: Config, systemType: SystemType): void {
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
  config: Config,
  systemType: SystemType,
  itemId: string
): void {
  if (!find(config, [...systemType.split('/'), itemId])) {
    throw new ClientError(CLIENT_ERROR_MESSAGES.ITEM_ID_NOT_FOUND);
  }
}

/**
 * Checks if config includes system type.
 * @param config - The config of myGEKKO device.
 * @param systemType - The system type.
 */
export function available(config: Config, systemType: SystemType): boolean {
  return Boolean(find(config, systemType.split('/')));
}
