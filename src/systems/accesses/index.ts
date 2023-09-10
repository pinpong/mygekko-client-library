import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { Access, AccessState } from "./types";
import { BaseSystem } from "../base";

const res = "accessdoors";

export class Accesses extends BaseSystem {
  private parseItem(system: string, status: string, key: string): Access {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[1]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      currentState: tryParseFloat(values[0]),
      startCondition: tryParseFloat(values[2]),
      gateRuntimePercentage: tryParseFloat(values[3]),
      accessType: tryParseFloat(values[4]),
    };
  }

  async getAll(): Promise<Access[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<Access> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }

  async setOpenState(id: string, state: AccessState): Promise<void> {
    let value = -1;
    switch (state) {
      case AccessState.close:
        value = -1;
        break;
      case AccessState.open:
        value = 1;
        break;
      case AccessState.keepOpen:
        value = 2;
        break;
    }
    await this.client.changeRequest(res, id, `${value}`);
  }
}
