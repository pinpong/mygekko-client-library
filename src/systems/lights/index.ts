import { BaseSystem } from "../base";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { Light, LightState } from "./types";

const res = "lights";

export class Lights extends BaseSystem {
  private parseItem(system: string, status: string, key: string): Light {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[0]),
      id: key,
      name: system[key].name,
      page: system[key].page,
    };
  }

  async getAll(): Promise<Light[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<Light> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }

  async setState(id: string, state: LightState): Promise<void> {
    await this.client.changeRequest(res, id, `${state}`);
  }

  async setDimLevel(id: string, dimLevel: number): Promise<void> {
    await this.client.changeRequest(res, id, `D${dimLevel}`);
  }

  async setTunableWhiteLevel(
    id: string,
    tunableWhiteLevel: number,
  ): Promise<void> {
    await this.client.changeRequest(res, id, `TW${tunableWhiteLevel}`);
  }

  async setColor(id: string, color: number): Promise<void> {
    await this.client.changeRequest(res, id, `C${color}`);
  }
}
