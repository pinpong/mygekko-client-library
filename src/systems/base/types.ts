export type BaseSystem = {
  id?: string;
  name?: string;
  page?: string;
  sumState?: SumState;
};

export enum SumState {
  "ok" = 0,
  "manualOf" = 1,
  "manualOn" = 2,
  "locked" = 3,
  "alarm" = 4,
}
