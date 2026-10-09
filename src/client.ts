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
import { available, throwErrorIfTrendIsNotEnabled } from './utils/errors/errorUtils';

/**
 * The way a request reaches the myGEKKO device.
 *  @group Client
 */
export type ConnectionType = 'local' | 'remote';

/** A route to the myGEKKO device */
type Route = {
  /** The connection type. */
  type: ConnectionType;
  /** The base url. */
  baseUrl: string;
  /** The auth query. */
  authQuery: string;
  /** The request timeout in milliseconds. */
  timeout: number;
  /** The time until the route is skipped after a connection error. */
  skipUntil: number;
};

/** The client configuration */
type ClientConfig = {
  /** The routes in the order they are tried. */
  routes: Route[];
  /** The attempts of a status request before a connection error is thrown. */
  attempts: number;
  /** The time in milliseconds a route is skipped after a connection error if another route exists. */
  retryInterval: number;
};

/**
 * The request options of a client.
 *  @group Client
 */
export type RequestConfig = {
  /** The request timeout in milliseconds, 2000 for the local and 5000 for the remote client by default */
  timeout?: number;
  /** The attempts of a status request before a connection error is thrown, 3 by default */
  attempts?: number;
};

/**
 * The remote client configuration.
 *  @group Client
 */
export type RemoteClientConfig = RequestConfig & {
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
export type LocalClientConfig = RequestConfig & {
  /** The myGEKKO device ip */
  ip: string;
  /** The local username  */
  username: string;
  /** The local password */
  password: string;
};

/**
 * The configuration of a client that uses the local api and falls back to the remote api.
 *  @group Client
 */
export type CombinedClientConfig = {
  /** The local access, used first */
  local?: Omit<LocalClientConfig, 'attempts'>;
  /** The remote access, used while the device is not reachable locally */
  remote?: Omit<RemoteClientConfig, 'attempts'>;
  /** The attempts of a status request before a connection error is thrown, 3 by default */
  attempts?: number;
  /** The time in milliseconds until an access that was not reachable is tried again, 60000 by default */
  retryInterval?: number;
};

/**
 * Checks if the endpoint sends a command.
 * @param endpoint - The myGEKKO device API endpoint.
 */
function isCommand(endpoint: string): boolean {
  return endpoint.includes('/scmd/');
}

/**
 * Checks if the request got no response within the timeout.
 * @param code - The error code of the failed request.
 */
function isTimeout(code: string | undefined): boolean {
  return code === 'ECONNABORTED' || code === 'ETIMEDOUT';
}

/**
 * Returns the route of the remote api.
 * @param config - The remote access.
 */
function remoteRoute(config: Omit<RemoteClientConfig, 'attempts'>): Route {
  return {
    type: 'remote',
    baseUrl: 'https://live.my-gekko.com/api/v1',
    authQuery: `username=${config.username}&key=${config.apiKey}&gekkoid=${config.gekkoId}`,
    timeout: config.timeout ?? 5000,
    skipUntil: 0,
  };
}

/**
 * Returns the route of the local api.
 * @param config - The local access.
 */
function localRoute(config: Omit<LocalClientConfig, 'attempts'>): Route {
  return {
    type: 'local',
    baseUrl: `http://${config.ip}/api/v1`,
    authQuery: `username=${config.username}&password=${config.password}`,
    timeout: config.timeout ?? 2000,
    skipUntil: 0,
  };
}

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
export type SubSystemStatusResponse = { [name: string]: { value: string } | undefined };

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
  /** The routes in the order they are tried */
  private readonly routes: Route[];
  /** The attempts of a status request */
  private readonly attempts: number;
  /** The time in milliseconds a route is skipped after a connection error */
  private readonly retryInterval: number;
  /** The connection type of the last successful request */
  private _connectionType: ConnectionType | null = null;

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

  /**
   * The connection type of the last successful request, null before the first one.
   */
  public get connectionType(): ConnectionType | null {
    return this._connectionType;
  }

  /**
   * The systems the myGEKKO device supports, empty until the client is initialized.
   */
  public get supportedSystems(): SystemType[] {
    return Object.values(SystemType).filter((systemType) =>
      available(this.systemConfig, systemType)
    );
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
    this.routes = config.routes;
    this.attempts = config.attempts;
    this.retryInterval = config.retryInterval;
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
      const response = await this.get<T>(endpoint);
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
          case 471:
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
      } else if (isAxiosError(error)) {
        throw new ClientError(
          isTimeout(error.code)
            ? CLIENT_ERROR_MESSAGES.TIMEOUT
            : CLIENT_ERROR_MESSAGES.NO_CONNECTION,
          { cause: error }
        );
      } else if (error instanceof Error) {
        throw new Error(error.message, { cause: error });
      } else {
        throw new ClientError(CLIENT_ERROR_MESSAGES.UNKNOWN_ERROR);
      }
    }
  }

  /**
   * Sends the request, a route that is not reachable is skipped for a while if another one exists.
   * @param endpoint - The myGEKKO device API endpoint.
   */
  private async get<T>(endpoint: string): Promise<{ data: T }> {
    const now = Date.now();
    const reachable = this.routes.filter((route) => route.skipUntil <= now);
    const routes = reachable.length ? reachable : this.routes;
    let failure: unknown;

    for (const route of routes) {
      try {
        const response = await this.send<T>(route, endpoint, route === routes[routes.length - 1]);
        this._connectionType = route.type;
        return response;
      } catch (error) {
        if (!isAxiosError(error) || error.response) {
          throw error;
        }
        route.skipUntil = Date.now() + this.retryInterval;
        // a command that timed out may have been executed, it is not sent on another route
        if (isCommand(endpoint) && isTimeout(error.code)) {
          throw error;
        }
        failure = error;
      }
    }
    throw failure;
  }

  /**
   * Sends the request on a route, a status request is repeated on connection errors.
   * @param route - The route to use.
   * @param endpoint - The myGEKKO device API endpoint.
   * @param repeat - Whether a status request is repeated, not needed if another route follows.
   */
  private async send<T>(route: Route, endpoint: string, repeat: boolean): Promise<{ data: T }> {
    // a command is never repeated on a route, it may have been executed although the response got lost
    const attempts = repeat && !isCommand(endpoint) ? this.attempts : 1;

    for (let attempt = 1; ; attempt++) {
      try {
        return await axios.get<T>(`${route.baseUrl}${endpoint}${route.authQuery}`, {
          timeout: route.timeout,
        });
      } catch (error) {
        if (attempt >= attempts || !isAxiosError(error) || error.response) {
          throw error;
        }
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
    super({ routes: [remoteRoute(config)], attempts: config.attempts ?? 3, retryInterval: 0 });
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
    super({ routes: [localRoute(config)], attempts: config.attempts ?? 3, retryInterval: 0 });
  }
}

/**
 * The client class using the local api first and the remote api as fallback.
 *  @group Client
 */
export class CombinedClient extends Client {
  /**
   * The combined client constructor.
   * @param config - The combined client configuration with at least one access.
   * @throws {@link ClientError}
   */
  public constructor(config: CombinedClientConfig) {
    if (!config.local && !config.remote) {
      throw new ClientError(CLIENT_ERROR_MESSAGES.MISSING_ACCESS);
    }
    super({
      routes: [
        ...(config.local ? [localRoute(config.local)] : []),
        ...(config.remote ? [remoteRoute(config.remote)] : []),
      ],
      attempts: config.attempts ?? 3,
      retryInterval: config.retryInterval ?? 60000,
    });
  }
}
