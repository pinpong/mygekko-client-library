import { BaseSystem } from "../base";
import {
  RoomTemperature,
  RoomTemperatureWorkingModeKnx,
  RoomTemperatureWorkingModeStandard,
} from "./types";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";

const res = "roomTemps";

export class RoomTemperatures extends BaseSystem {
  private parseItem(
    system: string,
    status: string,
    key: string,
  ): RoomTemperature {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[6]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      temperature: tryParseFloat(values[0]),
      temperatureSetPoint: tryParseFloat(values[1]),
      valveOpeningLevel: tryParseFloat(values[2]),
      workingMode: tryParseFloat(values[3]),
      reserved: values[4],
      temperatureAdjustment: tryParseFloat(values[5]),
      coolingModeState: tryParseFloat(values[7]),
      relativeHumidity: tryParseFloat(values[8]),
      airQualityLevel: tryParseFloat(values[8]),
      floorTemperature: tryParseFloat(values[10]),
      deviceModel: tryParseFloat(values[11]),
    };
  }

  async getAll(): Promise<RoomTemperature[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<RoomTemperature> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }

  async setTemperaturSetPoint(id: string, temperature: number): Promise<void> {
    await this.client.changeRequest(res, id, `S${temperature}`);
  }

  async setTemperatureAdjust(id: string, temperature: number): Promise<void> {
    await this.client.changeRequest(res, id, `K${temperature}`);
  }

  async setWorkingMode(
    id: string,
    mode: RoomTemperatureWorkingModeStandard | RoomTemperatureWorkingModeKnx,
  ): Promise<void> {
    await this.client.changeRequest(res, id, `M${mode}`);
  }
}
