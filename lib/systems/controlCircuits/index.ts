import { Client } from "../../client";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";
import { ControlCircuit } from "./types";

const res = "controlcircuits";

export class ControlCircuits extends Client {
  private parseControlCircuitItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: ControlCircuit = {
      sumState: tryParseFloat(values[2]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      sensorValue: tryParseFloat(values[0]),
      sensorType: tryParseFloat(values[1]),
      pump1WorkingPowerLevel: tryParseFloat(values[3]),
      pump2WorkingPowerLevel: tryParseFloat(values[4]),
      pump3WorkingPowerLevel: tryParseFloat(values[5]),
    };
    return item;
  }

  async getControlCircuits(): Promise<ControlCircuit[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseControlCircuitItem(system, status, key);
    });
  }

  async getControlCircuit(id: string): Promise<ControlCircuit> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseControlCircuitItem(this.system[res], status, id);
  }
}
