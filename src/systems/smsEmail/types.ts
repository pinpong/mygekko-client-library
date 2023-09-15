import { BaseSystemType } from '../base/types';

export type SmsEmail = BaseSystemType & {
  /** The current state */
  currentState: SmsEmailState | null;
};

/** The sms email states */
export enum SmsEmailState {
  'off' = 0,
  'on' = 1,
}
