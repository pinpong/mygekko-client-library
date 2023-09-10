import { Client } from "../../client";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";
import { HotWaterCirculation, HotWaterCirculationState } from "./types";

const res = "hotwater_circulations";

export class HotWaterCirculations extends Client {
  private parseHotWaterCirculationItem(
    system: string,
    status: string,
    key: string,
  ) {
    const values = valuesToStringList(status, key);
    const item: HotWaterCirculation = {
      sumState: tryParseFloat(values[4]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      pumpType: tryParseFloat(values[0]),
      currentState: tryParseFloat(values[1]),
      returnWaterTemperature: tryParseFloat(values[2]),
      returnWaterTemperatureSetPoint: tryParseFloat(values[3]),
    };
    return item;
  }

  async getHotWaterCirculations(): Promise<HotWaterCirculation[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseHotWaterCirculationItem(system, status, key);
    });
  }

  async getHotWaterCirculation(id: string): Promise<HotWaterCirculation> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseHotWaterCirculationItem(this.system[res], status, id);
  }

  async setHotWaterCirculationState(
    id: string,
    state: HotWaterCirculationState,
  ) {
    await this.changeRequest(res, id, `${state}`);
  }
}
