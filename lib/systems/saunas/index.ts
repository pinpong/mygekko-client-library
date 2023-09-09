import { Client } from "../../client";
import { tryParseInt } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";
import { Sauna, SaunaWorkingMode } from "./types";

const res = "saunas";

export class Saunas extends Client {
  private parseSaunaItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: Sauna = {
      sumState: tryParseInt(values[3]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      workingMode: tryParseInt(values[0]),
      currentState: tryParseInt(values[1]),
      errorState: tryParseInt(values[4]),
      roomTemperature: tryParseInt(values[5]),
      roomTemperatureSetPoint: tryParseInt(values[6]),
      burnerTemperature: tryParseInt(values[7]),
      roomRelativeHumidityLevel: tryParseInt(values[8]),
      roomRelativeHumiditySetPointLevel: tryParseInt(values[9]),
    };
    return item;
  }

  async getSaunas(): Promise<Sauna[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseSaunaItem(system, status, key);
    });
  }

  async getSauna(id: string): Promise<Sauna> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseSaunaItem(this.system[res], status, id);
  }

  async setSaunaMode(id: string, mode: SaunaWorkingMode) {
    await this.changeRequest(res, id, `${mode}`);
  }
}
