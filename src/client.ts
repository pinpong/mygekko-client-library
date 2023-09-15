import axios, { isAxiosError } from 'axios';

import { CLIENT_ERROR } from './errors';
import { Accesses } from './systems/accesses';
import { Actions } from './systems/actions';
import { AirConditioners } from './systems/airConditioners';
import { AlarmSystems } from './systems/alarmSystems';
import { Analyses } from './systems/analyses';
import { SystemType } from './systems/base/types';
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
import { Vents } from './systems/vents';
import { WallBoxes } from './systems/wallBoxes';
import { Weather } from './systems/weather';
import { throwErrorIfTrendIsNotEnabled } from './utils/errorUtils';

/** The client configuration */
type ClientConfig = {
  /** The base url. */
  baseUrl: string;
  /** The auth query. */
  authQuery: string;
};

/** The remote client configuration */
export type RemoteClientConfig = {
  /** The myGEKKO account username */
  username: string;
  /** The myGEKKO device id */
  gekkoId: string;
  /** The remote api key */
  apiKey: string;
};

/** The local client configuration */
export type LocalClientConfig = {
  /** The myGEKKO device ip */
  ip: string;
  /** The local username  */
  username: string;
  /** The local password */
  password: string;
};

/** The system Configuration of myGEKKO device. */
export type SystemConfig = string | { [key in SystemType]: SystemConfig };

/** The system status response. */
export type SystemStatusResponse = { [itemId: string]: ItemStatusResponse };

/** The system item status response. */
export type ItemStatusResponse = {
  sumstate: {
    value: string;
  };
};

/** The trend item */
export type TrendItemResponse = {
  /** The return value */
  returnValue: number | null;
  /** The trend data */
  trendData: number[] | null;
  /** The trend path */
  path: string | null;
  /** The internal item name */
  itemname: string | null;
  /** The start timestamp */
  tstart: number | null;
  /** The end timestamp */
  tend: number | null;
  /** The sampl */
  sampl: number | null;
  /** The data count */
  datacount: number | null;
  /** The sub value */
  subvalue: number | null;
};

/** The abstract client class. */
export abstract class Client {
  /** The base urls */
  private readonly baseUrl: string;
  /** The auth query params */
  private readonly authQueryString: string;

  /** The myGEKKO device system configuration */
  private _systemConfig: SystemConfig = '';
  /** The myGEKKO device trend configuration */
  private _trendConfig: SystemConfig = '';

  /**
   * The myGEKKO device system configuration
   * @returns {SystemConfig} the myGEKKO device system configuration
   */
  public get systemConfig(): SystemConfig {
    return this._systemConfig;
  }

  /**
   * The myGEKKO device trend configuration
   * @returns {SystemConfig} the myGEKKO device trend configuration
   */
  public get trendConfig(): SystemConfig {
    return this._trendConfig;
  }

  /** The {@link Accesses} class instance */
  public readonly accesses: Accesses = new Accesses(this);
  /** The {@link Actions} class instance */
  public readonly actions: Actions = new Actions(this);
  /** The {@link AirConditioners} class instance */
  public readonly airConditioners: AirConditioners = new AirConditioners(this);
  /** The {@link AlarmSystems} class instance */
  public readonly alarmSystems: AlarmSystems = new AlarmSystems(this);
  /** The {@link Blinds} class instance */
  public readonly blinds: Blinds = new Blinds(this);
  /** The {@link Cameras} class instance */
  public readonly cameras: Cameras = new Cameras(this);
  /** The {@link Clocks} class instance */
  public readonly clocks: Clocks = new Clocks(this);
  /** The {@link ControlCircuits} class instance */
  public readonly controlCircuits: ControlCircuits = new ControlCircuits(this);
  /** The {@link EnergyCosts} class instance */
  public readonly energyCosts: EnergyCosts = new EnergyCosts(this);
  /** The {@link EnergyManagers} class instance */
  public readonly energyManagers: EnergyManagers = new EnergyManagers(this);
  /** The {@link Stoves} class instance */
  public readonly stoves: Stoves = new Stoves(this);
  /** The {@link GekkoInfo} class instance */
  public readonly gekkoInfo: GekkoInfo = new GekkoInfo(this);
  /** The {@link GlobalAlarm} class instance */
  public readonly globalAlarm: GlobalAlarm = new GlobalAlarm(this);
  /** The {@link HeatingCircuits} class instance */
  public readonly heatingCircuits: HeatingCircuits = new HeatingCircuits(this);
  /** The {@link HeatingSystems} class instance */
  public readonly heatingSystems: HeatingSystems = new HeatingSystems(this);
  /** The {@link HotWaterCirculations} class instance */
  public readonly hotWaterCirculations: HotWaterCirculations = new HotWaterCirculations(this);
  /** The {@link HotWaterSystems} class instance */
  public readonly hotWaterSystems: HotWaterSystems = new HotWaterSystems(this);
  /** The {@link Lights} class instance */
  public readonly lights: Lights = new Lights(this);
  /** The {@link Loads} class instance */
  public readonly loads: Loads = new Loads(this);
  /** The {@link Logics} class instance */
  public readonly logics: Logics = new Logics(this);
  /** The {@link MultiRooms} class instance */
  public readonly multiRooms: MultiRooms = new MultiRooms(this);
  /** The {@link Pools} class instance */
  public readonly pools: Pools = new Pools(this);
  /** The {@link RoomTemperatures} class instance */
  public readonly roomTemperatures: RoomTemperatures = new RoomTemperatures(this);
  /** The {@link Saunas} class instance */
  public readonly saunas: Saunas = new Saunas(this);
  /** The {@link SmsEmails} class instance */
  public readonly smsEmails: SmsEmails = new SmsEmails(this);
  /** The {@link Analyses} class instance */
  public readonly analyses: Analyses = new Analyses(this);
  /** The {@link Vents} class instance */
  public readonly vents: Vents = new Vents(this);
  /** The {@link WallBoxes} class instance */
  public readonly wallBoxes: WallBoxes = new WallBoxes(this);
  /** The {@link Weather} class instance */
  public readonly weather: Weather = new Weather(this);

  /**
   * The constructor of Client
   * @param {SystemConfig} config  myGEKKO device configuration
   */
  protected constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl;
    this.authQueryString = config.authQuery;
  }

  /** Initialize the client and load the system and trend configurations */
  public async initialize(): Promise<void> {
    if (this.systemConfig) {
      throw Error(CLIENT_ERROR.ALREADY_INITIALIZED);
    }
    this._systemConfig = await this.internalRequest<SystemConfig>('/var?');
    this._trendConfig = await this.internalRequest<SystemConfig>('/trend?');
  }

  /** Rescan the myGEKKO device system and trend configurations */
  public async rescan(): Promise<void> {
    if (!this.systemConfig) {
      throw Error(CLIENT_ERROR.SYSTEM_NOT_INITIALIZED);
    }
    this._systemConfig = await this.internalRequest('/var?');
    this._trendConfig = await this.internalRequest('/trend?');
  }

  /**
   * Makes a http request
   * @param {string} endpoint the myGEKKO device API endpoint
   * @returns {string} the response
   */
  public async request<T>(endpoint: string): Promise<T> {
    if (!this.systemConfig) {
      throw Error(CLIENT_ERROR.SYSTEM_NOT_INITIALIZED);
    }
    return await this.internalRequest<T>(endpoint);
  }

  /**
   * internal http request wrapper.
   * @param {string} endpoint the myGEKKO device API endpoint
   * @returns {string} the response
   * @throws {Error}
   */
  private async internalRequest<T>(endpoint: string): Promise<T> {
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

  /**
   * Makes system status http request to the myGEKKO device API.
   * @param {SystemType}  res the myGEKKO device API endpoint
   * @returns {string} the response
   */
  public async systemStatusRequest(res: SystemType): Promise<SystemStatusResponse> {
    return await this.request<SystemStatusResponse>(`/var/${res}/status?`);
  }

  /**
   * Makes system status http request to the myGEKKO device API for a single item.
   * @param {SystemType}  res the myGEKKO device API endpoint
   * @param {string} itemId the item id
   * @returns {string} the response
   */
  public async itemStatusRequest(res: SystemType, itemId: string): Promise<ItemStatusResponse> {
    return await this.request<ItemStatusResponse>(`/var/${res}/${itemId}/status?`);
  }

  /**
   * Makes update request to the myGEKKO device API.
   * @param {SystemType}  res the myGEKKO device API endpoint
   * @param {string} itemId  the item id
   * @param {string} query the query params
   * @returns {string} the response
   */
  public async changeRequest(res: SystemType, itemId: string, query: string): Promise<string> {
    return await this.request<string>(`/var/${res}/${itemId}/scmd/set?value=${query}&`);
  }

  /**
   * Makes status request to the myGEKKO device API to get a single item trend by system.
   * @param {SystemType}  res the myGEKKO device API endpoint
   * @param {string} itemId  the item id
   * @param {string} trendId the item trend id
   * @param {string} startDate the start date as valid date string
   * @param {string} endDate the end date as valid date string
   * @param {number} count  the data count
   * @returns {string} the response
   */
  public async getTrendByItemId(
    res: SystemType,
    itemId: string,
    trendId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<TrendItemResponse> {
    throwErrorIfTrendIsNotEnabled(this.systemConfig, res);
    return await this.request<TrendItemResponse>(
      `/trend/${res}/${itemId}/${trendId}/status?tstart=${startDate}&tend=${endDate}&datacount=${count}&`
    );
  }
}

/** The remote client class. */
export class RemoteClient extends Client {
  /**
   * The local client constructor.
   * @param {SystemConfig} config  the local client configuration.
   */
  public constructor(config: RemoteClientConfig) {
    super({
      baseUrl: 'https://live.my-gekko.com/api/v1',
      authQuery: `username=${config.username}&key=${config.apiKey}&gekkoid=${config.gekkoId}`,
    });
  }
}

/** The local client class. */
export class LocalClient extends Client {
  /**
   * The local client constructor.
   * @param {SystemConfig} config  the remote client configuration.
   */
  public constructor(config: LocalClientConfig) {
    super({
      baseUrl: `http://${config.ip}/api/v1`,
      authQuery: `username=${config.username}&password=${config.password}`,
    });
  }
}
