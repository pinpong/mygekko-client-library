import { BaseSystem } from "../base";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";
import { GekkoInfoItem } from "./types";

const res = "globals/network";

export class GekkoInfo extends BaseSystem {
  private parseItem(status: string, key: string): GekkoInfoItem {
    return {
      sumState: null,
      id: key,
      name: null,
      page: null,
      gekkoName: status["gekkoname"]["value"],
      language: status["language"]["value"],
      version: status["version"]["value"],
      hardware: status["hardware"]["value"],
    };
  }

  async get(): Promise<GekkoInfoItem> {
    const system = this.client.systemConfig["globals"]["network"];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.client.systemStatusRequest(res);
    return this.parseItem(status, null);
  }
}
