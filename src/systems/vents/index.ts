import { Client } from "../../client";
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
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";

const res = "vents";

export class Vents extends Client {
  private parseVentItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: Vent = {
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
    return item;
  }

  async getVents(): Promise<Vent[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseVentItem(system, status, key);
    });
  }

  async getVent(id: string): Promise<Vent> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseVentItem(this.system[res], status, id);
  }

  async setVentMode(
    id: string,
    mode:
      | VentWorkingModeProxxonV1
      | VentWorkingModeProxxonV2
      | VentWorkingModeWestaflex
      | VentWorkingModeStiebelTecalor
      | VentWorkingModeIndividual
      | VentWorkingModePluggit,
  ) {
    await this.changeRequest(res, id, `M${mode}`);
  }

  async setVentLevel(id: string, ventLevel: VentLevel) {
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
    await this.changeRequest(res, id, `${level}`);
  }

  async setVentByPassState(id: string, state: VentBypassState) {
    await this.changeRequest(res, id, `BY${state}`);
  }

  async setVentCoolingModeState(id: string, state: CoolingModeState) {
    await this.changeRequest(res, id, `C${state}`);
  }

  async setDehumidificationState(id: string, state: DehumidificationState) {
    await this.changeRequest(res, id, `D${state}`);
  }
}
