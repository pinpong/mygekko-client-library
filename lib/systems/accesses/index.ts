import { Client } from "../../client";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { Access, AccessState } from "./types";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";

const res = "accessdoors";

export class Accesses extends Client {
  private parseAccessItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: Access = {
      sumState: tryParseFloat(values[1]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      currentState: tryParseFloat(values[0]),
      startCondition: tryParseFloat(values[2]),
      gateRuntimePercentage: tryParseFloat(values[3]),
      accessType: tryParseFloat(values[4]),
    };

    return item;
  }

  async getAccesses(): Promise<Access[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseAccessItem(system, status, key);
    });
  }

  async getAccess(id: string): Promise<Access> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseAccessItem(this.system[res], status, id);
  }

  async setAccessOpenState(id: string, state: AccessState) {
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
    await this.changeRequest(res, id, `${value}`);
  }
}
