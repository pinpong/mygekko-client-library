import { SystemConfig } from '../client';
import { CLIENT_ERROR } from '../errors';
import { SystemTypes } from '../systems/base/types';

export function throwErrorIfSystemIsNotEnabled(systemConfig: SystemConfig, res: SystemTypes): void {
  if (systemConfig.valueOf() == 0) {
    throw Error(CLIENT_ERROR.SYSTEM_NOT_INITIALIZED);
  }

  if (!available(systemConfig, res)) {
    throw Error(CLIENT_ERROR.SYSTEM_NOT_SUPPORTED);
  }
}

export function throwErrorIfTrendIsNotAvailable(trendConfig: SystemConfig, res: SystemTypes): void {
  if (trendConfig.valueOf() == 0) {
    throw new Error(CLIENT_ERROR.SYSTEM_NOT_INITIALIZED);
  }
  if (!available(trendConfig, res)) {
    throw new Error(CLIENT_ERROR.TREND_NOT_SUPPORTED);
  }
}

export function throwErrorIfItemIdIsNoAvailable(
  config: SystemConfig,
  res: SystemTypes,
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

function available(config: SystemConfig, res: SystemTypes): boolean {
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
