import { BaseSystem } from "../base";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import {
  AirConditioner,
  AirConditionerState,
  AirConditionerWorkingMode,
} from "./types";

const res = "air_handling_unit";

export class AirConditioners extends BaseSystem {
  private parseItem(
    system: string,
    status: string,
    key: string,
  ): AirConditioner {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[25]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      supplyAirTemperature: tryParseFloat(values[0]),
      supplyAirTemperatureSetPoint: tryParseFloat(values[1]),
      exhaustAirTemperature: tryParseFloat(values[2]),
      exhaustAirTemperatureSetPoint: tryParseFloat(values[3]),
      outsideAirTemperature: tryParseFloat(values[4]),
      outgoingAirTemperature: tryParseFloat(values[5]),
      supplyRelativeHumidityLevel: tryParseFloat(values[6]),
      supplyRelativeHumiditySetPointLevel: tryParseFloat(values[7]),
      exhaustRelativeHumidityLevel: tryParseFloat(values[8]),
      exhaustRelativeHumiditySetPointLevel: tryParseFloat(values[9]),
      airQualityLevel: tryParseFloat(values[10]),
      airQualitySetPointLevel: tryParseFloat(values[11]),
      supplyPressureValue: tryParseFloat(values[12]),
      supplyPressureSetPointValue: tryParseFloat(values[13]),
      exhaustPressureValue: tryParseFloat(values[14]),
      exhaustPressureSetPointValue: tryParseFloat(values[15]),
      workingLevelSetPointLevel: tryParseFloat(values[16]),
      supplyState: tryParseFloat(values[17]),
      supplyWorkingLevel: tryParseFloat(values[18]),
      supplyFlapOpeningLevel: tryParseFloat(values[19]),
      exhaustState: tryParseFloat(values[20]),
      exhaustWorkingLevel: tryParseFloat(values[21]),
      exhaustFlapOpeningLevel: tryParseFloat(values[22]),
      currentState: tryParseFloat(values[23]),
      workingMode: tryParseFloat(values[24]),
    };
  }

  async getAll(): Promise<AirConditioner[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<AirConditioner> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }

  async setState(id: string, state: AirConditionerState): Promise<void> {
    await this.client.changeRequest(res, id, `${state}`);
  }

  async setMode(id: string, mode: AirConditionerWorkingMode): Promise<void> {
    await this.client.changeRequest(res, id, `M${mode}`);
  }

  async setPower(id: string, power: number): Promise<void> {
    await this.client.changeRequest(res, id, `P${power}`);
  }

  async setMinFlap(id: string, flaps: number): Promise<void> {
    await this.client.changeRequest(res, id, `F${flaps}`);
  }

  async setAirQuality(id: string, airQuality: number): Promise<void> {
    await this.client.changeRequest(res, id, `Q${airQuality}`);
  }

  async setHumidity(id: string, humidity: number): Promise<void> {
    await this.client.changeRequest(res, id, `H${humidity}`);
  }
}
