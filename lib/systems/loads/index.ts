import { Client } from "../../client";
import { Load, LoadState } from "./types";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";

const res = "loads";

export class Loads extends Client {
  private parseLoadItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: Load = {
      sumState: tryParseFloat(values[0]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      currentState: tryParseFloat(values[1]),
    };
    return item;
  }

  async getLoads(): Promise<Load[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseLoadItem(system, status, key);
    });
  }

  async getLoad(id: string): Promise<Load> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseLoadItem(this.system[res], status, id);
  }

  async setLoadState(id: string, state: LoadState) {
    await this.changeRequest(res, id, `${state}`);
  }
}
