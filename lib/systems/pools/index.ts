import { Client } from "../../client";
import { Pool } from "./types";
import { tryParseInt } from "../../utils/numberUtils";
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
      sumState: tryParseInt(values[3]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      workingMode: tryParseInt(values[0]),
      filteringState: tryParseInt(values[1]),
      backwashState: tryParseInt(values[2]),
      waterTemperature: tryParseInt(values[4]),
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
