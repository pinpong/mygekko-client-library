import { Client } from "../../client";
import { tryParseFloat } from "../../utils/numberUtils";
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
      sumState: tryParseFloat(values[8]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      deviceModel: tryParseFloat(values[0]),
      flowTemperature: tryParseFloat(values[1]),
      returnFlowTemperature: tryParseFloat(values[2]),
      dewPoint: tryParseFloat(values[3]),
      pumpWorkingLevel: tryParseFloat(values[4]),
      coolingModeState: tryParseFloat(values[5]),
      flowTemperatureSetPoint: tryParseFloat(values[6]),
      valveOpeningLevel: tryParseFloat(values[7]),
      currentState: tryParseFloat(values[9]),
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
