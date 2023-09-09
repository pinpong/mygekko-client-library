import { Client } from "../../client";
import { tryParseInt } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";
import { HeatingCircuit } from "./types";

const res = "heatingcircuits";

export class HeatingCircuits extends Client {
  private parseHeatingCircuitItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: HeatingCircuit = {
      sumState: tryParseInt(values[8]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      deviceModel: tryParseInt(values[0]),
      flowTemperature: tryParseInt(values[1]),
      returnFlowTemperature: tryParseInt(values[2]),
      dewPoint: tryParseInt(values[3]),
      pumpWorkingLevel: tryParseInt(values[4]),
      coolingModeState: tryParseInt(values[5]),
      flowTemperatureSetPoint: tryParseInt(values[6]),
      valveOpeningLevel: tryParseInt(values[7]),
      currentState: tryParseInt(values[9]),
    };
    return item;
  }

  async getHeatingCircuits(): Promise<HeatingCircuit[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseHeatingCircuitItem(system, status, key);
    });
  }

  async getHeatingCircuit(id: string): Promise<HeatingCircuit> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseHeatingCircuitItem(this.system[res], status, id);
  }
}
