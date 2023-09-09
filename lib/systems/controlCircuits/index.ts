import { Client } from "../../client";
import { tryParseInt } from "../../utils/numberUtils";
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
      sumState: tryParseInt(values[2]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      sensorValue: tryParseInt(values[0]),
      sensorType: tryParseInt(values[1]),
      pump1WorkingPowerLevel: tryParseInt(values[3]),
      pump2WorkingPowerLevel: tryParseInt(values[4]),
      pump3WorkingPowerLevel: tryParseInt(values[5]),
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
