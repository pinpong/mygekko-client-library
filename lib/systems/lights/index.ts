import { Client } from "../../client";
import { tryParseInt } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";
import { Light, LightState } from "./types";

const res = "lights";

export class Lights extends Client {
  private parseLightItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: Light = {
      sumState: tryParseInt(values[0]),
      id: key,
      name: system[key].name,
      page: system[key].page,
    };
    return item;
  }

  async getLights(): Promise<Light[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseLightItem(system, status, key);
    });
  }

  async getLight(id: string): Promise<Light> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseLightItem(this.system[res], status, id);
  }

  async setLightState(id: string, state: LightState) {
    await this.changeRequest(res, id, `${state}`);
  }

  async setLightDimLevel(id: string, dimLevel: number) {
    await this.changeRequest(res, id, `D${dimLevel}`);
  }

  async setLightTunableWhiteLevel(id: string, tunableWhiteLevel: number) {
    await this.changeRequest(res, id, `TW${tunableWhiteLevel}`);
  }

  async setLightColor(id: string, color: number) {
    await this.changeRequest(res, id, `C${color}`);
  }
}
