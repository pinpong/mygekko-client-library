import { BaseSystemType } from '../base/types';

export type Logic = BaseSystemType & {
  /** The current value */
  value: number | null;
};
