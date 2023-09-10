import { BaseSystem } from "../base";
import { Pool } from "./types";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";

const res = "pools";

export class Pools extends BaseSystem {
  private parseItem(system: string, status: string, key: string): Pool {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[3]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      workingMode: tryParseFloat(values[0]),
      filteringState: tryParseFloat(values[1]),
      backwashState: tryParseFloat(values[2]),
      waterTemperature: tryParseFloat(values[4]),
    };
  }

  async getAll(): Promise<Pool[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<Pool> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }

  /// TODO: implement all other function

  async setTemperatur(id: string, temperature: number): Promise<void> {
    await this.client.changeRequest(res, id, `T${temperature}`);
  }
}
