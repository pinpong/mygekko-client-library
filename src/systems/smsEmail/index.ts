import { BaseSystem } from "../base";
import { SmsEmail, SmsEmailState } from "./types";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { EnergyManager } from "../energyManagers/types";

const res = "smsemail";

export class SmsEmails extends BaseSystem {
  private parseItem(system: string, status: string, key: string): SmsEmail {
    const values = valuesToStringList(status, key);

    return {
      sumState: null,
      id: key,
      name: system[key].name,
      page: system[key].page,
      currentState: tryParseFloat(values[0]),
    };
  }

  async getAll(): Promise<EnergyManager[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<EnergyManager> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }

  async setState(id: string, state: SmsEmailState): Promise<void> {
    let value = -1;
    switch (state) {
      case SmsEmailState.off:
        value = -1;
        break;
      case SmsEmailState.on:
        value = 1;
        break;
    }
    await this.client.changeRequest(res, id, `${value}`);
  }
}
