import { Client } from "../../client";
import { HeatingSystem } from "./types";
import { tryParseInt } from "../../utils/numberUtils";
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
      sumState: tryParseInt(values[5]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      deviceModel: tryParseInt(values[0]),
      coolingModeState: tryParseInt(values[1]),
      flowTemperatureValue: tryParseInt(values[2]),
      flowTemperatureSetPoint: tryParseInt(values[3]),
      currentState: tryParseInt(values[4]),
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
