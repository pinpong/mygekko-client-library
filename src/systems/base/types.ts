export type BaseSystemType = {
  itemId: string | null;
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

export enum SystemTypes {
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

export type Trend = {
  itemId: string | null;
  name: string | null;
  trends: TrendItem[] | null;
};

export type TrendItem = {
  trendId: string | null;
  description: string | null;
  unit: string | null;
  data: number[] | null;
  dataCount: number | null;
  startDate: string;
  endDate: string;
};
