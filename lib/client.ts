import fetch from "isomorphic-unfetch";

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

  public async request<T>(endpoint: string): Promise<string> {
    if (!this.system) {
      throw Error("Not initialized");
    }
    return await this.internalRequest(endpoint);
  }

  public async internalRequest<T>(endpoint: string): Promise<string> {
    console.log(`${this.baseUrl}${endpoint}${this.authQueryString}`);
    const response = await fetch(
      `${this.baseUrl}${endpoint}${this.authQueryString}`,
    );
    if (response.ok) {
      try {
        return await response.json();
      } catch (e) {
        return "";
      }
    } else {
      /// TODO: throw errors
      throw new Error(response.statusText);
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
