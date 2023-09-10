import { Client } from "../../client";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";
import { HotWaterSystem, HotWaterSystemState } from "./types";

const res = "hotwater_systems";

export class HotWaterSystems extends Client {
  private parseHotWaterSystemItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: HotWaterSystem = {
      sumState: tryParseFloat(values[7]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      deviceModel: tryParseFloat(values[0]),
      coolingModeState: tryParseFloat(values[1]),
      waterTemperatureSetPoint: tryParseFloat(values[2]),
      waterTemperatureTop: tryParseFloat(values[3]),
      waterTemperatureBottom: tryParseFloat(values[4]),
      collectorTemperature: tryParseFloat(values[5]),
      currentState: tryParseFloat(values[6]),
    };
    return item;
  }

  async getHotWaterSystems(): Promise<HotWaterSystem[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseHotWaterSystemItem(system, status, key);
    });
  }

  async getHotWaterSystem(id: string): Promise<HotWaterSystem> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseHotWaterSystemItem(this.system[res], status, id);
  }

  async setHotWaterSystemState(id: string, state: HotWaterSystemState) {
    await this.changeRequest(res, id, `${state}`);
  }

  async setHotWaterSystemTemperature(id: string, temperatur: number) {
    await this.changeRequest(res, id, `T${temperatur}`);
  }
}
