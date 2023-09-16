import { BaseSystemType } from '../base/types';

/** @group Systems */
export type SmsEmail = BaseSystemType & {
  /** The current state */
  currentState: SmsEmailState | null;
};

/**
 * The sms email states.
 * @group Systems
 */
export enum SmsEmailState {
  'off' = 0,
  'on' = 1,
}
