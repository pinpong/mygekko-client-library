import { LocalClientBase, RemoteClientBase } from "./client";
import { applyMixins } from "./utils";
import { Accesses } from "./systems/accesses";
import { AlarmSystems } from "./systems/alarmSystems";
import { Actions } from "./systems/actions";
import { Blinds } from "./systems/blinds";
import { Cams } from "./systems/cams";
import { Clocks } from "./systems/clocks";
import { EnergyCosts } from "./systems/energyCosts";
import { EnergyManagers } from "./systems/energyManagers";
import { HotWaterSystems } from "./systems/hotWaterSystems";
import { Lights } from "./systems/lights";
import { MultiRooms } from "./systems/multiRoom";
import { Weather } from "./systems/weather";
import { Loads } from "./systems/loads";
import { Logics } from "./systems/logics";
import { GekkoInfo } from "./systems/gekkoInfo";
import { GlobalAlarm } from "./systems/globalAlarm";
import { Pools } from "./systems/pools";
import { Saunas } from "./systems/saunas";
import { Trends } from "./systems/trends";
import { Vents } from "./systems/vents";
import { WallBoxes } from "./systems/wallBoxes";
import { SmsEmails } from "./systems/smsEmail";
import { RoomTemperatures } from "./systems/roomTemps";
import { AirConditioners } from "./systems/airConditioners";
import { Fireplaces } from "./systems/fireplaces";
import { HeatingCircuits } from "./systems/heatingCircuit";
import { HeatingSystems } from "./systems/heatingSystem";
import { HotWaterCirculations } from "./systems/hotWaterCirculation";
import { ControlCircuits } from "./systems/controlCircuits";

export class RemoteClient extends RemoteClientBase {}

export interface RemoteClient
  extends Accesses,
    Actions,
    AirConditioners,
    AlarmSystems,
    Blinds,
    Cams,
    Clocks,
    ControlCircuits,
    EnergyCosts,
    EnergyManagers,
    Fireplaces,
    GekkoInfo,
    GlobalAlarm,
    HeatingCircuits,
    HeatingSystems,
    HotWaterCirculations,
    HotWaterSystems,
    Lights,
    Loads,
    Logics,
    MultiRooms,
    Pools,
    RoomTemperatures,
    Saunas,
    SmsEmails,
    Trends,
    Vents,
    WallBoxes,
    Weather {}

applyMixins(RemoteClient, [
  Accesses,
  Actions,
  AirConditioners,
  AlarmSystems,
  Blinds,
  Cams,
  Clocks,
  ControlCircuits,
  EnergyCosts,
  EnergyManagers,
  Fireplaces,
  GekkoInfo,
  GlobalAlarm,
  HeatingCircuits,
  HeatingSystems,
  HotWaterCirculations,
  HotWaterSystems,
  Lights,
  Loads,
  Logics,
  MultiRooms,
  Pools,
  RoomTemperatures,
  Saunas,
  SmsEmails,
  Trends,
  Vents,
  WallBoxes,
  Weather,
]);

export class LocalClient extends LocalClientBase {}

export interface LocalClient
  extends Accesses,
    Actions,
    AirConditioners,
    AlarmSystems,
    Blinds,
    Cams,
    Clocks,
    ControlCircuits,
    EnergyCosts,
    EnergyManagers,
    Fireplaces,
    GekkoInfo,
    GlobalAlarm,
    HeatingCircuits,
    HeatingSystems,
    HotWaterCirculations,
    HotWaterSystems,
    Lights,
    Loads,
    Logics,
    MultiRooms,
    Pools,
    RoomTemperatures,
    Saunas,
    SmsEmails,
    Trends,
    Vents,
    WallBoxes,
    Weather {}

applyMixins(LocalClient, [
  Accesses,
  Actions,
  AirConditioners,
  AlarmSystems,
  Blinds,
  Cams,
  Clocks,
  ControlCircuits,
  EnergyCosts,
  EnergyManagers,
  Fireplaces,
  GekkoInfo,
  GlobalAlarm,
  HeatingCircuits,
  HeatingSystems,
  HotWaterCirculations,
  HotWaterSystems,
  Lights,
  Loads,
  Logics,
  MultiRooms,
  Pools,
  RoomTemperatures,
  Saunas,
  SmsEmails,
  Trends,
  Vents,
  WallBoxes,
  Weather,
]);
