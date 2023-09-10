import { BaseSystem } from "../base";
import { Logic } from "./types";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";

const res = "alarms_logics";

export class Logics extends BaseSystem {
  private parseItem(system: string, status: string, key: string): Logic {
    const values = valuesToStringList(status, key);

    return {
      sumState: null,
      id: key,
      name: system[key].name,
      page: system[key].page,
      value: tryParseFloat(values[0]),
    };
  }

  async getAll(): Promise<Logic[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<Logic> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }
}
