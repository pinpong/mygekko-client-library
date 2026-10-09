import axios, { isAxiosError } from 'axios';

import { CLIENT_ERROR_MESSAGES, ClientError } from './errors';
import {
  Accesses,
  Actions,
  AirConditioners,
  AlarmSystems,
  Analyses,
  Blinds,
  Cameras,
  Clocks,
  ControlCircuits,
  EnergyCosts,
  EnergyManagers,
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
  Stoves,
  Vents,
  WallBoxes,
  Weather,
} from './systems';
import { SystemType } from './systems/base/types';
import { throwErrorIfTrendIsNotEnabled } from './utils/errors/errorUtils';

/** The client configuration */
type ClientConfig = {
  /** The base url. */
  baseUrl: string;
  /** The auth query. */
  authQuery: string;
};

/**
 * The remote client configuration.
 *  @group Client
 */
export type RemoteClientConfig = {
  /** The myGEKKO account username */
  username: string;
  /** The myGEKKO device id */
  gekkoId: string;
  /** The remote api key */
  apiKey: string;
};

/**
 * The local client configuration.
 *  @group Client
 */
export type LocalClientConfig = {
  /** The myGEKKO device ip */
  ip: string;
  /** The local username  */
  username: string;
  /** The local password */
  password: string;
};

/**
 * The configuration of a single item.
 * @group Client
 */
export type ItemConfig = {
  /** The item name */
  name: string;
  /** The item page */
  page?: string;
  /** The image path of a camera */
  imagepath?: string;
  /** The stream path of a camera */
  streampath?: string;
  /** The cgi path of a camera */
  cgipath?: string;
};

/**
 * The item configurations of a system by item id.
 * @group Client
 */
export type SystemItemsConfig = { [itemId: string]: ItemConfig };

/**
 * The system Configuration of myGEKKO device by system.
 *  @group Client
 */
export type SystemConfig = { [system: string]: SystemItemsConfig };

/**
 * The description of a single trend.
 * @group Client
 */
export type TrendDescription = {
  /** The trend description */
  description: string;
  /** The trend unit */
  unit: string;
};

/**
 * The trend descriptions by trend id.
 * @group Client
 */
export type TrendDescriptions = { [trendId: string]: TrendDescription };

/**
 * The trend configuration of a single item.
 * @group Client
 */
export type ItemTrendConfig = {
  /** The item name */
  name: string;
  /** The trends of the item */
  trends: TrendDescriptions;
};

/**
 * The item trend configurations of a system by item id.
 * @group Client
 */
export type SystemItemsTrendConfig = { [itemId: string]: ItemTrendConfig };

/**
 * The trend configuration of myGEKKO device by system.
 * @group Client
 */
export type TrendConfig = { [system: string]: SystemItemsTrendConfig } & {
  /** The trends of the global systems */
  globals: SystemItemsTrendConfig & {
    /** The weather trends */
    meteo: TrendDescriptions;
  };
};

/**
 * The system status response.
 *  @group Client
 */
export type SystemStatusResponse = { [itemId: string]: ItemStatusResponse };

/**
 * The status response of a system without items.
 * @group Client
 */
export type SubSystemStatusResponse = { [name: string]: { value: string } };

/**
 * The system item status response.
 * @group Client
 */
export type ItemStatusResponse = {
  /**
   *
   */
  sumstate: {
    value: string;
  };
  /** Further values by name, e.g. the user totals of a wall box */
  [name: string]: { value: string } | undefined;
};

/**
 * The trend item.
 * @group Client
 */
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
  private _systemConfig: SystemConfig | '' = '';
  /** The myGEKKO device trend configuration */
  private _trendConfig: TrendConfig | '' = '';

  /**
   * The myGEKKO device system configuration, an empty string until the client is initialized.
   */
  public get systemConfig(): SystemConfig {
    return this._systemConfig as SystemConfig;
  }

  /**
   * The myGEKKO device trend configuration, an empty string until the client is initialized.
   */
  public get trendConfig(): TrendConfig {
    return this._trendConfig as TrendConfig;
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
   * The constructor of Client.
   * @param config - MyGEKKO device configuration.
   */
  protected constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl;
    this.authQueryString = config.authQuery;
  }

  /**
   * Initialize the client and load the system and trend configurations.
   * @throws {@link ClientError}
   */
  public async initialize(): Promise<void> {
    if (this.systemConfig) {
      throw Error(CLIENT_ERROR_MESSAGES.ALREADY_INITIALIZED);
    }
    this._systemConfig = await this.internalRequest<SystemConfig>('/var?');
    this._trendConfig = await this.internalRequest<TrendConfig>('/trend?');
  }

  /**
   * Rescan the myGEKKO device system and trend configurations.
   * @throws {@link ClientError}
   */
  public async rescan(): Promise<void> {
    if (!this.systemConfig) {
      throw Error(CLIENT_ERROR_MESSAGES.SYSTEM_NOT_INITIALIZED);
    }
    this._systemConfig = await this.internalRequest('/var?');
    this._trendConfig = await this.internalRequest('/trend?');
  }

  /**
   * Makes a http request.
   * @param endpoint - The myGEKKO device API endpoint.
   * @throws {@link ClientError}
   */
  public async request<T>(endpoint: string): Promise<T> {
    if (!this.systemConfig) {
      throw Error(CLIENT_ERROR_MESSAGES.SYSTEM_NOT_INITIALIZED);
    }
    return await this.internalRequest<T>(endpoint);
  }

  /**
   * Internal http request wrapper.
   * @param endpoint - The myGEKKO device API endpoint.
   * @throws {@link ClientError}
   */
  private async internalRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}${this.authQueryString}`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 400:
            throw new ClientError(CLIENT_ERROR_MESSAGES.BAD_REQUEST);
          case 403:
            throw new ClientError(CLIENT_ERROR_MESSAGES.BAD_LOGIN);
          case 404:
            throw new ClientError(CLIENT_ERROR_MESSAGES.RESOURCE_NOT_FOUND);
          case 405:
            throw new ClientError(CLIENT_ERROR_MESSAGES.PERMISSION_DENIED);
          case 410:
            throw new ClientError(CLIENT_ERROR_MESSAGES.GEKKO_OFFLINE);
          case 429:
            throw new ClientError(CLIENT_ERROR_MESSAGES.TO_MANY_REQUEST);
          case 444:
            throw new ClientError(CLIENT_ERROR_MESSAGES.NOT_EXECUTED);
          case 470:
            throw new ClientError(CLIENT_ERROR_MESSAGES.SERVICE_NOT_REGISTERED_OR_EXPIRED);
          case 500:
            throw new ClientError(CLIENT_ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
          case 503:
            throw new ClientError(CLIENT_ERROR_MESSAGES.SERVICE_NOT_AVAILABLE);
          default:
            throw new Error(
              `${CLIENT_ERROR_MESSAGES.SERVICE_NOT_AVAILABLE}: ${error.response.status}`,
              { cause: error }
            );
        }
      } else if (isAxiosError(error) && error.request) {
        throw new Error(error.message, { cause: error });
      } else if (error instanceof Error) {
        throw new Error(error.message, { cause: error });
      } else {
        throw new ClientError(CLIENT_ERROR_MESSAGES.UNKNOWN_ERROR);
      }
    }
  }

  /**
   * Makes system status http request to the myGEKKO device API.
   * @param systemType - The myGEKKO device API endpoint.
   * @throws {@link ClientError}
   */
  public async systemStatusRequest<T = SystemStatusResponse>(systemType: SystemType): Promise<T> {
    return await this.request<T>(`/var/${systemType}/status?`);
  }

  /**
   * Makes system status http request to the myGEKKO device API for a single item.
   * @param systemType - The myGEKKO device API endpoint.
   * @param itemId - The item id.
   * @throws {@link ClientError}
   */
  public async itemStatusRequest(
    systemType: SystemType,
    itemId: string
  ): Promise<ItemStatusResponse> {
    return await this.request<ItemStatusResponse>(`/var/${systemType}/${itemId}/status?`);
  }

  /**
   * Makes update request to the myGEKKO device API.
   * @param systemType - The myGEKKO device API endpoint.
   * @param itemId - The item id.
   * @param query - The query params.
   * @throws {@link ClientError}
   */
  public async changeRequest(
    systemType: SystemType,
    itemId: string,
    query: string
  ): Promise<string> {
    return await this.request<string>(`/var/${systemType}/${itemId}/scmd/set?value=${query}&`);
  }

  /**
   * Makes status request to the myGEKKO device API to get a single item trend by system.
   * @param systemType - The myGEKKO device API endpoint.
   * @param itemId - The item id.
   * @param trendId - The item trend id.
   * @param startDate - The start date as valid date string.
   * @param endDate - The end date as valid date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  public async getTrendByItemId(
    systemType: SystemType,
    itemId: string,
    trendId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<TrendItemResponse> {
    throwErrorIfTrendIsNotEnabled(this.systemConfig, systemType);
    return await this.request<TrendItemResponse>(
      `/trend/${systemType}/${itemId}/${trendId}/status?tstart=${startDate}&tend=${endDate}&datacount=${count}&`
    );
  }
}

/**
 * The remote client class.
 * @group Client
 */
export class RemoteClient extends Client {
  /**
   * The local client constructor.
   * @param config - The local client configuration.
   */
  public constructor(config: RemoteClientConfig) {
    super({
      baseUrl: 'https://live.my-gekko.com/api/v1',
      authQuery: `username=${config.username}&key=${config.apiKey}&gekkoid=${config.gekkoId}`,
    });
  }
}

/**
 * The local client class.
 *  @group Client
 */
export class LocalClient extends Client {
  /**
   * The local client constructor.
   * @param config - The remote client configuration.
   */
  public constructor(config: LocalClientConfig) {
    super({
      baseUrl: `http://${config.ip}/api/v1`,
      authQuery: `username=${config.username}&password=${config.password}`,
    });
  }
}
