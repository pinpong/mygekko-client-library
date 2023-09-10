import { BaseSystem } from "../base";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { HotWaterSystem, HotWaterSystemState } from "./types";

const res = "hotwater_systems";

export class HotWaterSystems extends BaseSystem {
  private parseItem(
    system: string,
    status: string,
    key: string,
  ): HotWaterSystem {
    const values = valuesToStringList(status, key);

    return {
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
  }

  async getAll(): Promise<HotWaterSystem[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<HotWaterSystem> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }

  async setState(id: string, state: HotWaterSystemState): Promise<void> {
    await this.client.changeRequest(res, id, `${state}`);
  }

  async setTemperature(id: string, temperatur: number): Promise<void> {
    await this.client.changeRequest(res, id, `T${temperatur}`);
  }
}
