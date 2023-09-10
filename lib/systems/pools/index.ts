import { Client } from "../../client";
import { Pool } from "./types";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";

const res = "pools";

export class Pools extends Client {
  private parsePoolItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: Pool = {
      sumState: tryParseFloat(values[3]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      workingMode: tryParseFloat(values[0]),
      filteringState: tryParseFloat(values[1]),
      backwashState: tryParseFloat(values[2]),
      waterTemperature: tryParseFloat(values[4]),
    };
    return item;
  }

  async getPools(): Promise<Pool[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parsePoolItem(system, status, key);
    });
  }

  async getPool(id: string): Promise<Pool> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parsePoolItem(this.system[res], status, id);
  }

  /// TODO: implement all other function

  async setPoolTemperatur(id: string, temperature: number) {
    await this.changeRequest(res, id, `T${temperature}`);
  }
}
