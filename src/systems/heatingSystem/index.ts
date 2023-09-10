import { Client } from "../../client";
import { HeatingSystem } from "./types";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";

const res = "heatingsystems";

export class HeatingSystems extends Client {
  private parseHeatingSystemItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: HeatingSystem = {
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
    return item;
  }

  async getHeatingSystems(): Promise<HeatingSystem[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseHeatingSystemItem(system, status, key);
    });
  }

  async getHeatingSystem(id: string): Promise<HeatingSystem> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseHeatingSystemItem(this.system[res], status, id);
  }
}
