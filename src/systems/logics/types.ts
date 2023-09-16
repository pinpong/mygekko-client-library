import { BaseSystemType } from '../base/types';

/** @group Systems */
export type Logic = BaseSystemType & {
  /** The current value */
  value: number | null;
};
