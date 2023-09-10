import { BaseSystem } from "../base";
import {
  CoolingModeState,
  DehumidificationState,
  Vent,
  VentBypassState,
  VentLevel,
  VentWorkingModeIndividual,
  VentWorkingModePluggit,
  VentWorkingModeProxxonV1,
  VentWorkingModeProxxonV2,
  VentWorkingModeStiebelTecalor,
  VentWorkingModeWestaflex,
} from "./types";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";

const res = "vents";

export class Vents extends BaseSystem {
  private parseItem(system: string, status: string, key: string): Vent {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[14]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      ventLevel: tryParseFloat(values[0]),
      deviceModel: tryParseFloat(values[1]),
      workingMode: tryParseFloat(values[2]),
      bypassState: tryParseFloat(values[3]),
      maximumWorkingLevel: tryParseFloat(values[4]),
      relativeHumidity: tryParseFloat(values[5]),
      airQuality: tryParseFloat(values[6]),
      co2: tryParseFloat(values[7]),
      supplyAirTemperature: tryParseFloat(values[8]),
      exhaustAirTemperature: tryParseFloat(values[9]),
      outsideAirTemperature: tryParseFloat(values[10]),
      outgoingAirTemperature: tryParseFloat(values[11]),
      supplyAirWorkingLevel: tryParseFloat(values[12]),
      exhaustAirWorkingLevel: tryParseFloat(values[13]),
      subWorkingMode: tryParseFloat(values[15]),
      coolingModeState: tryParseFloat(values[16]),
      dehumidificationState: tryParseFloat(values[17]),
      bypassMode: tryParseFloat(values[18]),
    };
  }

  async getAll(): Promise<Vent[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<Vent> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }
  async setMode(
    id: string,
    mode:
      | VentWorkingModeProxxonV1
      | VentWorkingModeProxxonV2
      | VentWorkingModeWestaflex
      | VentWorkingModeStiebelTecalor
      | VentWorkingModeIndividual
      | VentWorkingModePluggit,
  ): Promise<void> {
    await this.client.changeRequest(res, id, `M${mode}`);
  }

  async setLevel(id: string, ventLevel: VentLevel): Promise<void> {
    let level = -1;
    switch (ventLevel) {
      case VentLevel.off:
        level = -1;
        break;
      case VentLevel.level1:
        level = 1;
        break;
      case VentLevel.level2:
        level = 2;
        break;
      case VentLevel.level3:
        level = 3;
        break;
      case VentLevel.level4:
        level = 4;
        break;
    }
    await this.client.changeRequest(res, id, `${level}`);
  }

  async setByPassState(id: string, state: VentBypassState): Promise<void> {
    await this.client.changeRequest(res, id, `BY${state}`);
  }

  async setCoolingModeState(
    id: string,
    state: CoolingModeState,
  ): Promise<void> {
    await this.client.changeRequest(res, id, `C${state}`);
  }

  async setDehumidificationState(
    id: string,
    state: DehumidificationState,
  ): Promise<void> {
    await this.client.changeRequest(res, id, `D${state}`);
  }
}
