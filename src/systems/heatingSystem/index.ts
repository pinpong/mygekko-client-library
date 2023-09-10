import { BaseSystem } from "../base";
import { HeatingSystem } from "./types";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";

const res = "heatingsystems";

export class HeatingSystems extends BaseSystem {
  private parseItem(
    system: string,
    status: string,
    key: string,
  ): HeatingSystem {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[5]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      deviceModel: tryParseFloat(values[0]),
      coolingModeState: tryParseFloat(values[1]),
      flowTemperatureValue: tryParseFloat(values[2]),
      flowTemperatureSetPoint: tryParseFloat(values[3]),
      currentState: tryParseFloat(values[4]),
    };
  }

  async getAll(): Promise<HeatingSystem[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<HeatingSystem> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }
}
