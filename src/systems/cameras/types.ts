import { BaseSystemType } from '../base/types';

export type Camera = BaseSystemType & {
  newRecordCount: number | null;
  imageUrl: string | null;
  streamUrl: string | null;
  cgiUrl: string | null;
};
