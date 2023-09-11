import fetch from "isomorphic-unfetch";
import { CLIENT_ERROR } from "./errors";
import { Clocks } from "./systems/clocks";
import { Accesses } from "./systems/accesses";
import { Actions } from "./systems/actions";
import { AirConditioners } from "./systems/airConditioners";
import { AlarmSystems } from "./systems/alarmSystems";
import { Blinds } from "./systems/blinds";
import { Cams } from "./systems/cams";
import { ControlCircuits } from "./systems/controlCircuits";
import { EnergyCosts } from "./systems/energyCosts";
import { EnergyManagers } from "./systems/energyManagers";
import { Fireplaces } from "./systems/fireplaces";
import { GekkoInfo } from "./systems/gekkoInfo";
import { GlobalAlarm } from "./systems/globalAlarm";
import { HeatingCircuits } from "./systems/heatingCircuit";
import { HeatingSystems } from "./systems/heatingSystem";
import { HotWaterCirculations } from "./systems/hotWaterCirculation";
import { HotWaterSystems } from "./systems/hotWaterSystems";
import { Lights } from "./systems/lights";
import { Loads } from "./systems/loads";
import { Logics } from "./systems/logics";
import { MultiRooms } from "./systems/multiRoom";
import { Pools } from "./systems/pools";
import { RoomTemperatures } from "./systems/roomTemps";
import { Saunas } from "./systems/saunas";
import { SmsEmails } from "./systems/smsEmail";
import { Trends } from "./systems/trends";
import { Vents } from "./systems/vents";
import { WallBoxes } from "./systems/wallBoxes";
import { Weather } from "./systems/weather";

type ClientConfig = {
  baseUrl: string;
  authQuery: string;
};

type RemoteConfig = {
  username: string;
  gekkoId: string;
  apiKey: string;
};

type LocalConfig = {
  ip: string;
  username: string;
  password: string;
};

export abstract class Client {
  private readonly baseUrl: string;
  private readonly authQueryString: string;

  systemConfig?: string;

  accesses = new Accesses(this);
  actions = new Actions(this);
  airConditioners = new AirConditioners(this);
  alarmSystems = new AlarmSystems(this);
  blinds = new Blinds(this);
  cams = new Cams(this);
  clocks = new Clocks(this);
  controlCircuits = new ControlCircuits(this);
  energyCosts = new EnergyCosts(this);
  energyManagers = new EnergyManagers(this);
  fireplaces = new Fireplaces(this);
  gekkoInfo = new GekkoInfo(this);
  globalAlarm = new GlobalAlarm(this);
  heatingCircuits = new HeatingCircuits(this);
  heatingSystems = new HeatingSystems(this);
  hotWaterCirculations = new HotWaterCirculations(this);
  hotWaterSystems = new HotWaterSystems(this);
  lights = new Lights(this);
  loads = new Loads(this);
  logics = new Logics(this);
  multiRooms = new MultiRooms(this);
  pools = new Pools(this);
  roomTemperatures = new RoomTemperatures(this);
  saunas = new Saunas(this);
  smsEmails = new SmsEmails(this);
  trends = new Trends(this);
  vents = new Vents(this);
  wallBoxes = new WallBoxes(this);
  weather = new Weather(this);

  protected constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl;
    this.authQueryString = config.authQuery;
  }

  public async initialize(): Promise<void> {
    if (this.systemConfig) {
      throw Error(CLIENT_ERROR.ALREADY_INITIALIZED);
    }
    this.systemConfig = await this.internalRequest("?");
  }

  public async rescan(): Promise<void> {
    if (!this.systemConfig) {
      throw Error(CLIENT_ERROR.SYSTEM_NOT_INITIALIZED);
    }
    this.systemConfig = await this.internalRequest("?");
  }

  async request(endpoint: string): Promise<string> {
    if (!this.systemConfig) {
      throw Error(CLIENT_ERROR.SYSTEM_NOT_INITIALIZED);
    }
    return await this.internalRequest(endpoint);
  }

  private async internalRequest(endpoint: string): Promise<string> {
    let response: Response;
    try {
      response = await fetch(
        `${this.baseUrl}${endpoint}${this.authQueryString}`,
        {},
      );
    } catch (e) {
      throw new Error(e);
    }
    if (response.ok) {
      return response.body.toString().startsWith("OK")
        ? {}
        : await response.json();
    }

    switch (response.status) {
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
        throw Error(
          `${CLIENT_ERROR.SERVICE_NOT_AVAILABLE}: ${response.status}`,
        );
    }
  }

  async systemStatusRequest(res: string): Promise<string> {
    return await this.request(`/${res}/status?`);
  }

  async itemStatusRequest(res: string, id: string): Promise<string> {
    return await this.request(`/${res}/${id}/status?`);
  }

  async changeRequest(res: string, id: string, query: string): Promise<string> {
    return await this.request(`/${res}/${id}/scmd/set?value=${query}&`);
  }
}

export class RemoteClient extends Client {
  constructor(config: RemoteConfig) {
    super({
      baseUrl: "https://live.my-gekko.com/api/v1/var",
      authQuery: `username=${config.username}&key=${config.apiKey}&gekkoid=${config.gekkoId}`,
    });
  }
}

export class LocalClient extends Client {
  constructor(config: LocalConfig) {
    super({
      baseUrl: "http://${config.ip}/api/v1/var",
      authQuery: `username=${config.username}&password=${config.password}`,
    });
  }
}
