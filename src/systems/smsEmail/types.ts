import { BaseSystem } from '../base/types';

export type SmsEmail = BaseSystem & {
  currentState?: SmsEmailState;
};

export enum SmsEmailState {
  'off' = 0,
  'on' = 1,
}
