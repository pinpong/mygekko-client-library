import fetch from "isomorphic-unfetch";
import { CLIENT_ERROR } from "./errors";

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

  protected system?: string;

  protected constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl;
    this.authQueryString = config.authQuery;
  }

  public async initialize() {
    if (this.system) {
      throw Error("Already initialized");
    }
    this.system = await this.internalRequest("?");
  }

  public async request(endpoint: string): Promise<string> {
    if (!this.system) {
      throw Error("Not initialized");
    }
    return await this.internalRequest(endpoint);
  }

  public async internalRequest(endpoint: string): Promise<string> {
    console.log(`${this.baseUrl}${endpoint}${this.authQueryString}`);

    let response: Response;
    try {
      response = await fetch(
        `${this.baseUrl}${endpoint}${this.authQueryString}`,
        {},
      );
    } catch (e) {
      console.log(typeof e);
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

  public async systemStatusRequest(res: string) {
    return await this.request(`/${res}/status?`);
  }

  public async itemStatusRequest(res: string, id: string) {
    return await this.request(`/${res}/${id}/status?`);
  }

  public async changeRequest(res: string, id: string, query: string) {
    return await this.request(`/${res}/${id}/scmd/set?value=${query}&`);
  }
}

export abstract class RemoteClientBase extends Client {
  private readonly username: string;
  private readonly gekkoId: string;
  private readonly apiKey: string;

  constructor(config: RemoteConfig) {
    super({
      baseUrl: `https://live.my-gekko.com/api/v1/var`,
      authQuery: `username=${config.username}&key=${config.apiKey}&gekkoid=${config.gekkoId}`,
    });
    this.username = config.username;
    this.gekkoId = config.gekkoId;
    this.apiKey = config.apiKey;
  }
}

export class LocalClientBase extends Client {
  private readonly ip: string;
  private readonly username: string;
  private readonly password: string;

  constructor(config: LocalConfig) {
    super({
      baseUrl: `http://${config.ip}/api/v1/var`,
      authQuery: `username=${config.username}&password=${config.password}`,
    });
    this.ip = config.ip;
    this.username = config.username;
    this.password = config.password;
  }
}
