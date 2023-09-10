import { BaseSystem } from "../base";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { Fireplace } from "./types";

const res = "stoven";

export class Fireplaces extends BaseSystem {
  private parseItem(system: string, status: string, key: string): Fireplace {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[4]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      temperature: tryParseFloat(values[0]),
      flapOpeningLevel: tryParseFloat(values[1]),
      currentState: tryParseFloat(values[2]),
      workingState: tryParseFloat(values[3]),
    };
  }

  async getAll(): Promise<Fireplace[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<Fireplace> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }
}
