export type BaseSystemType = {
  id: string | null;
  name: string | null;
  page: string | null;
  sumState: SumState | null;
};

export enum SumState {
  'ok' = 0,
  'manualOf' = 1,
  'manualOn' = 2,
  'locked' = 3,
  'alarm' = 4,
}
