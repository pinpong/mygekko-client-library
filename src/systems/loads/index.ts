import { BaseSystem } from "../base";
import { Load, LoadState } from "./types";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";

const res = "loads";

export class Loads extends BaseSystem {
  private parseItem(system: string, status: string, key: string): Load {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[0]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      currentState: tryParseFloat(values[1]),
    };
  }

  async getAll(): Promise<Load[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<Load> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }

  async setState(id: string, state: LoadState): Promise<void> {
    await this.client.changeRequest(res, id, `${state}`);
  }
}
