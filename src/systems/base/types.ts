/** The system base */
export type BaseSystemType = {
  /** The item id */
  itemId: string | null;
  /** The item name */
  name: string | null;
  /** The item page */
  page: string | null;
  /** The item sumstate */
  sumState: SumState | null;
};

/** The system sum states */
export enum SumState {
  'ok' = 0,
  'manualOf' = 1,
  'manualOn' = 2,
  'locked' = 3,
  'alarm' = 4,
}

/** The supported systems */
export enum SystemType {
  'globals' = 'globals',
  'weather' = 'globals/meteo',
  'network' = 'globals/network',
  'alarm' = 'alarm',
  'lights' = 'lights',
  'blinds' = 'blinds',
  'vents' = 'vents',
  'loads' = 'loads',
  'roomTemperatures' = 'roomtemps',
  'heatingSystems' = 'heatingsystems',
  'heatingCircuits' = 'heatingcircuits',
  'energyCosts' = 'energycosts',
  'alarmsLogics' = 'alarms_logics',
  'accesses' = 'accessdoors',
  'energyManagers' = 'energymanager',
  'alarmSystem' = 'alarmsystem',
  'multiRooms' = 'multirooms',
  'cameras' = 'cams',
  'smsEmail' = 'smsemail',
  'actions' = 'actions',
  'clocks' = 'clocks',
  'controlCircuits' = 'controlcircuits',
  'airConditioner' = 'air_handling_unit',
  'saunas' = 'saunas',
  'pools' = 'pools',
  'analyses' = 'trends',
  'wallBoxes' = 'emobils',
  'hotWaterSystems' = 'hotwater_systems',
  'hotWaterCirculations' = 'hotwater_circulations',
  'stoves' = 'stoves',
}

/** The trend */
export type Trend = {
  /** The trend item id */
  itemId: string | null;
  /** The trend name */
  name: string | null;
  /** The trends */
  trends: TrendItem[] | null;
};

/** The trend item */
export type TrendItem = {
  /** The trend id */
  trendId: string | null;
  /** The trend item description */
  description: string | null;
  /** The trend item unit */
  unit: string | null;
  /** The trend data */
  data: number[] | null;
  /** The trend data count */
  dataCount: number | null;
  /** The trend start date */
  startDate: string;
  /** The trend end date */
  endDate: string;
};
