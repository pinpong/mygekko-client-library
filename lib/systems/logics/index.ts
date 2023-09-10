import { Client } from "../../client";
import { Logic } from "./types";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";

const res = "alarms_logics";

export class Logics extends Client {
  private parseLoginItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: Logic = {
      sumState: null,
      id: key,
      name: system[key].name,
      page: system[key].page,
      value: tryParseFloat(values[0]),
    };
    return item;
  }

  async getLogics(): Promise<Logic[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseLoginItem(system, status, key);
    });
  }

  async getLogic(id: string): Promise<Logic> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseLoginItem(this.system[res], status, id);
  }
}
