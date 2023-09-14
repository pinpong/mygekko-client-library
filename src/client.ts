import axios, { isAxiosError } from 'axios';

import { CLIENT_ERROR } from './errors';
import { Accesses } from './systems/accesses';
import { Actions } from './systems/actions';
import { AirConditioners } from './systems/airConditioners';
import { AlarmSystems } from './systems/alarmSystems';
import { SystemTypes } from './systems/base/types';
import { Blinds } from './systems/blinds';
import { Cameras } from './systems/cameras';
import { Clocks } from './systems/clocks';
import { ControlCircuits } from './systems/controlCircuits';
import { EnergyCosts } from './systems/energyCosts';
import { EnergyManagers } from './systems/energyManagers';
import { GekkoInfo } from './systems/gekkoInfo';
import { GlobalAlarm } from './systems/globalAlarm';
import { HeatingCircuits } from './systems/heatingCircuit';
import { HeatingSystems } from './systems/heatingSystem';
import { HotWaterCirculations } from './systems/hotWaterCirculation';
import { HotWaterSystems } from './systems/hotWaterSystems';
import { Lights } from './systems/lights';
import { Loads } from './systems/loads';
import { Logics } from './systems/logics';
import { MultiRooms } from './systems/multiRoom';
import { Pools } from './systems/pools';
import { RoomTemperatures } from './systems/roomTemperatures';
import { Saunas } from './systems/saunas';
import { SmsEmails } from './systems/smsEmail';
import { Stoves } from './systems/stoves/stoves';
import { Analyses } from './systems/trends';
import { Vents } from './systems/vents';
import { WallBoxes } from './systems/wallBoxes';
import { Weather } from './systems/weather';
import { throwErrorIfTrendIsNotAvailable } from './utils/errorUtils';

type ClientConfig = {
  baseUrl: string;
  authQuery: string;
};

export type RemoteClientConfig = {
  username: string;
  gekkoId: string;
  apiKey: string;
};

export type LocalClientConfig = {
  ip: string;
  username: string;
  password: string;
};

export type SystemConfig = string | { [key in SystemTypes]: SystemConfig };

export abstract class Client {
  private readonly baseUrl: string;
  private readonly authQueryString: string;

  private _systemConfig: SystemConfig = '';
  private _trendConfig: SystemConfig = '';

  public get systemConfig(): SystemConfig {
    return this._systemConfig;
  }

  public get trendConfig(): SystemConfig {
    return this._trendConfig;
  }

  public readonly accesses = new Accesses(this);
  public readonly actions = new Actions(this);
  public readonly airConditioners = new AirConditioners(this);
  public readonly alarmSystems = new AlarmSystems(this);
  public readonly blinds = new Blinds(this);
  public readonly cameras = new Cameras(this);
  public readonly clocks = new Clocks(this);
  public readonly controlCircuits = new ControlCircuits(this);
  public readonly energyCosts = new EnergyCosts(this);
  public readonly energyManagers = new EnergyManagers(this);
  public readonly fireplaces = new Stoves(this);
  public readonly gekkoInfo = new GekkoInfo(this);
  public readonly globalAlarm = new GlobalAlarm(this);
  public readonly heatingCircuits = new HeatingCircuits(this);
  public readonly heatingSystems = new HeatingSystems(this);
  public readonly hotWaterCirculations = new HotWaterCirculations(this);
  public readonly hotWaterSystems = new HotWaterSystems(this);
  public readonly lights = new Lights(this);
  public readonly loads = new Loads(this);
  public readonly logics = new Logics(this);
  public readonly multiRooms = new MultiRooms(this);
  public readonly pools = new Pools(this);
  public readonly roomTemperatures = new RoomTemperatures(this);
  public readonly saunas = new Saunas(this);
  public readonly smsEmails = new SmsEmails(this);
  public readonly analyses = new Analyses(this);
  public readonly vents = new Vents(this);
  public readonly wallBoxes = new WallBoxes(this);
  public readonly weather = new Weather(this);

  protected constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl;
    this.authQueryString = config.authQuery;
  }

  public async initialize(): Promise<void> {
    if (this.systemConfig) {
      throw Error(CLIENT_ERROR.ALREADY_INITIALIZED);
    }
    this._systemConfig = await this.internalRequest('/var?');
    this._trendConfig = await this.internalRequest('/trend?');
  }

  public async rescan(): Promise<void> {
    if (!this.systemConfig) {
      throw Error(CLIENT_ERROR.SYSTEM_NOT_INITIALIZED);
    }
    this._systemConfig = await this.internalRequest('/var?');
    this._trendConfig = await this.internalRequest('/trend?');
  }

  public async request(endpoint: string): Promise<string> {
    if (!this.systemConfig) {
      throw Error(CLIENT_ERROR.SYSTEM_NOT_INITIALIZED);
    }
    return await this.internalRequest(endpoint);
  }

  private async internalRequest(endpoint: string): Promise<string> {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}${this.authQueryString}`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error(CLIENT_ERROR.BAD_REQUEST);
          case 403:
            throw new Error(CLIENT_ERROR.BAD_LOGIN);
          case 404:
            throw new Error(CLIENT_ERROR.RESOURCE_NOT_FOUND);
          case 405:
            throw new Error(CLIENT_ERROR.PERMISSION_DENIED);
          case 410:
            throw new Error(CLIENT_ERROR.GEKKO_OFFLINE);
          case 429:
            throw new Error(CLIENT_ERROR.TO_MANY_REQUEST);
          case 444:
            throw new Error(CLIENT_ERROR.NOT_EXECUTED);
          case 500:
            throw new Error(CLIENT_ERROR.INTERNAL_SERVER_ERROR);
          case 503:
            throw new Error(CLIENT_ERROR.SERVICE_NOT_AVAILABLE);
          default:
            throw Error(`${CLIENT_ERROR.SERVICE_NOT_AVAILABLE}: ${error.response.status}`);
        }
      } else if (isAxiosError(error) && error.request) {
        throw new Error(error.message);
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(CLIENT_ERROR.UNKNOWN_ERROR);
      }
    }
  }

  public async systemStatusRequest(res: SystemTypes): Promise<string> {
    return await this.request(`/var/${res}/status?`);
  }

  public async itemStatusRequest(res: SystemTypes, itemId: string): Promise<string> {
    return await this.request(`/var/${res}/${itemId}/status?`);
  }

  public async changeRequest(res: SystemTypes, itemId: string, query: string): Promise<string> {
    return await this.request(`/var/${res}/${itemId}/scmd/set?value=${query}&`);
  }

  public async getTrends(
    res: SystemTypes,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<string> {
    throwErrorIfTrendIsNotAvailable(this.systemConfig, res);
    return await this.request(
      `/trend/${res}/status?tstart=${startDate}&tend=${endDate}&datacount=${count}&`
    );
  }

  public async getTrend(
    res: SystemTypes,
    trendId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<string> {
    throwErrorIfTrendIsNotAvailable(this.systemConfig, res);
    return await this.request(
      `/trend/${res}/${trendId}/status?tstart=${startDate}&tend=${endDate}&datacount=${count}&`
    );
  }

  public async getTrendByItemId(
    res: SystemTypes,
    itemId: string,
    trendId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<string> {
    throwErrorIfTrendIsNotAvailable(this.systemConfig, res);
    return await this.request(
      `/trend/${res}/${itemId}/${trendId}/status?tstart=${startDate}&tend=${endDate}&datacount=${count}&`
    );
  }
}

export class RemoteClient extends Client {
  public constructor(config: RemoteClientConfig) {
    super({
      baseUrl: 'https://live.my-gekko.com/api/v1',
      authQuery: `username=${config.username}&key=${config.apiKey}&gekkoid=${config.gekkoId}`,
    });
  }
}

export class LocalClient extends Client {
  public constructor(config: LocalClientConfig) {
    super({
      baseUrl: `http://${config.ip}/api/v1`,
      authQuery: `username=${config.username}&password=${config.password}`,
    });
  }
}
