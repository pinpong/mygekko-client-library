import { Client } from "../../client";
import {
  RoomTemperature,
  RoomTemperatureWorkingModeKnx,
  RoomTemperatureWorkingModeStandard,
} from "./types";
import { tryParseInt } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";

const res = "roomTemps";

export class RoomTemperatures extends Client {
  private parseRoomTemperatureItem(
    system: string,
    status: string,
    key: string,
  ) {
    const values = valuesToStringList(status, key);
    const item: RoomTemperature = {
      sumState: tryParseInt(values[6]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      temperature: tryParseInt(values[0]),
      temperatureSetPoint: tryParseInt(values[1]),
      valveOpeningLevel: tryParseInt(values[2]),
      workingMode: tryParseInt(values[3]),
      reserved: tryParseInt(values[4]),
      temperatureAdjustment: tryParseInt(values[5]),
      coolingModeState: tryParseInt(values[7]),
      relativeHumidity: tryParseInt(values[8]),
      airQualityLevel: tryParseInt(values[8]),
      floorTemperature: tryParseInt(values[10]),
      deviceModel: tryParseInt(values[11]),
    };
    return item;
  }

  async getRoomTemperatures(): Promise<RoomTemperature[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseRoomTemperatureItem(system, status, key);
    });
  }

  async getRoomTemperature(id: string): Promise<RoomTemperature> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseRoomTemperatureItem(this.system[res], status, id);
  }

  async setRoomTemperatureSetPoint(id: string, temperature: number) {
    await this.changeRequest(res, id, `S${temperature}`);
  }

  async setRoomTemperatureAdjust(id: string, temperature: number) {
    await this.changeRequest(res, id, `K${temperature}`);
  }

  async setRoomTemperatureWorkingMode(
    id: string,
    mode: RoomTemperatureWorkingModeStandard | RoomTemperatureWorkingModeKnx,
  ) {
    await this.changeRequest(res, id, `M${mode}`);
  }
}
