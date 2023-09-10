import { Client } from "../../client";
import { Clock, ClockState } from "./types";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";

const res = "clocks";

export class Clocks extends Client {
  private parseClockItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: Clock = {
      sumState: tryParseFloat(values[2]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      currentState: tryParseFloat(values[0]),
      startCondition: tryParseFloat(values[1]),
    };
    return item;
  }

  async getClocks(): Promise<Clock[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseClockItem(system, status, key);
    });
  }

  async getClock(id: string): Promise<Clock> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseClockItem(this.system[res], status, id);
  }

  async setClockState(id: string, state: ClockState) {
    await this.changeRequest(res, id, `${state}`);
  }
}
