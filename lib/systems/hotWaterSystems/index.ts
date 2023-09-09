import { Client } from "../../client";
import { tryParseInt } from "../../utils/numberUtils";
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
      sumState: tryParseInt(values[7]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      deviceModel: tryParseInt(values[0]),
      coolingModeState: tryParseInt(values[1]),
      waterTemperatureSetPoint: tryParseInt(values[2]),
      waterTemperatureTop: tryParseInt(values[3]),
      waterTemperatureBottom: tryParseInt(values[4]),
      collectorTemperature: tryParseInt(values[5]),
      currentState: tryParseInt(values[6]),
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
