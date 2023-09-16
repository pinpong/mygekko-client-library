import { BaseSystemType } from '../base/types';

/** @group Systems */
export type Camera = BaseSystemType & {
  /** The current new records count */
  newRecordCount: number | null;
  /** The image url */
  imageUrl: string | null;
  /** The stream url */
  streamUrl: string | null;
  /** The cgi url */
  cgiUrl: string | null;
};
