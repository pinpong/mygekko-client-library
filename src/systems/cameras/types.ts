import { BaseSystemType } from '../base/types';

/** @group Systems */
export type Camera = BaseSystemType & {
  /** Whether new records are available, 1 if so and 0 if not */
  newRecordCount: number | null;
  /** The image url as configured on the device, it may contain credentials */
  imageUrl: string | null;
  /** The stream url as configured on the device, it may contain credentials */
  streamUrl: string | null;
  /** The cgi url */
  cgiUrl: string | null;
};
