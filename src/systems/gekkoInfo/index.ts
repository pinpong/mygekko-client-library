import { Client } from "../../client";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";
import { GekkoInfoItem } from "./types";

const res = "globals/network";

export class GekkoInfo extends Client {
  private parseGekkoInfoItem(status: string, key: string) {
    const item: GekkoInfoItem = {
      sumState: null,
      id: key,
      name: null,
      page: null,
      gekkoName: status["gekkoname"]["value"],
      language: status["language"]["value"],
      version: status["version"]["value"],
      hardware: status["hardware"]["value"],
    };
    return item;
  }

  async getGekkoInfo(): Promise<GekkoInfoItem> {
    const system = this.system["globals"]["network"];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);
    return this.parseGekkoInfoItem(status, null);
  }
}
